import './flickr/flickr';

$(document).ready(function () {

  var productDataTable;
  /**
   * Get all products
   */
  function loadTableData() {
    $.ajax({
      url: "/product",
      success: function (result) {
        reloadDataTable(result.data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        swal("Error", "Something went wrong while fetching data", "error");
      }
    });
  }

  /**
   * Set datatable
   */
  function reloadDataTable(data) {
    var i = 1;
    productDataTable = $('#productTable').DataTable({
      data,
      destroy: true,
      columns: [
        {
          targets: 0,
          responsivePriority: -1,
          data: null,
          render: function (data, type, row, meta) {
            return i++;
          }
        },
        { data: "name" },
        { data: "price" },
        {
          targets: -1,
          orderable: false,
          data: null,
          render: function (data, type, row, meta) {
            return `<button type='button' class='btn btn-success btn-update btn-sm mr-2' data-id=${data._id}> <i class="fa-solid fa-pen-to-square"></i> </button>
                    <button type='button' class='btn btn-danger btn-delete btn-sm' data-id=${data._id}> <i class="fa-solid fa-trash-can"></i> </button>`
          }
        }
      ],
    });
  }

  /*
  * Initial data load
  */
  loadTableData();

  /**
   * Open add new product modal
   */
  $("#btnAddProduct").click(function () {
    $("#errorMessage").html("");
    $("#errorAlert").hide();
    $("#productName").val("");
    $("#productPrice").val("");
    $("#productModalLabel").html("Add new product");
    $('#productModal').modal('show');
    $("#btnUpdateProduct").hide();
    $("#btnAddNewProduct").show();
  });

  /**
   * Add new product
   */
  $("#form-product").on('submit', function (e) {
    e.preventDefault();
    var name = $("#productName").val();
    var price = $("#productPrice").val();
    $.ajax({
      url: "/product",
      type: "POST",
      data: { name, price },
      success: function (result) {
        $("#errorMessage").html("");
        $("#errorAlert").hide();
        $("#productName").val("");
        $("#productPrice").val("");
        $('#productModal').modal('hide');
        swal("Success", "Prodcut insert successfully", "success");
        loadTableData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON);
        var errorMessage = jqXHR ? jqXHR.responseJSON.message : "";
        $("#errorMessage").html("<strong>Error: </strong>" + errorMessage);
        $("#errorAlert").show();
      }
    });
  });

  /**
   * Get edit product
   */
  $("#productTable").on("click", ".btn-update", function () {
    var id = $(this).data('id');
    $("#errorMessage").html("");
    $("#errorAlert").hide();
    $('#productModal').modal('show');
    $("#btnAddNewProduct").hide();
    $("#btnUpdateProduct").show();
    $("#btnUpdateProduct").data('id', id);
    $.ajax({
      url: `/product/${id}`,
      type: "GET",
      success: function (result) {
        $("#productModalLabel").html("Update product");
        $("#productName").val(result.data.name);
        $("#productPrice").val(result.data.price);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON);
        var errorMessage = jqXHR ? jqXHR.responseJSON.message : "";
        swal("Error", errorMessage ? errorMessage : "Something went wrong while fetching data", "error");
      }
    });
  })

  /**
   * Update product
   */
  $("#btnUpdateProduct").click(function () {
    var name = $("#productName").val();
    var price = $("#productPrice").val();
    var data = {};
    if (name) data.name = name;
    if (price) data.price = price;
    var id = $("#btnUpdateProduct").data('id');
    $.ajax({
      url: `/product/${id}`,
      type: "PUT",
      data: { name, price },
      success: function (result) {
        $("#errorMessage").html("");
        $("#errorAlert").hide();
        $("#productName").val("");
        $("#productPrice").val("");
        $('#productModal').modal('hide');
        swal("Success", "Prodcut updated successfully", "success");
        loadTableData();
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON);
        var errorMessage = jqXHR ? jqXHR.responseJSON.message : "";
        $("#errorMessage").html("<strong>Error: </strong>" + errorMessage);
        $("#errorAlert").show();
      }
    });
  });

  /**
   * Delete product
   */
  $("#productTable").on("click", ".btn-delete", function () {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          var id = $(this).data('id');
          $.ajax({
            url: `/product/${id}`,
            type: "DELETE",
            success: function (result) {
              swal({
                title: "Success",
                text: "Product deleted successfully",
                icon: "success",
              });
              loadTableData();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              var errorMessage = jqXHR ? jqXHR.responseJSON.message : "";
              swal("Error", errorMessage ? errorMessage : "Something went wrong while deleting product", "error");
            }
          });
        }
      })
  })
});