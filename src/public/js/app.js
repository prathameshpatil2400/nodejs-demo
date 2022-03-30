/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/resources/js/app.js":
/*!*********************************!*\
  !*** ./src/resources/js/app.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _flickr_flickr__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./flickr/flickr */ "./src/resources/js/flickr/flickr.js");
/* harmony import */ var _flickr_flickr__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_flickr_flickr__WEBPACK_IMPORTED_MODULE_0__);

$(document).ready(function () {
  var productDataTable;
  /**
   * Get all products
   */

  function loadTableData() {
    $.ajax({
      url: "/product",
      success: function success(result) {
        reloadDataTable(result.data);
      },
      error: function error(jqXHR, textStatus, errorThrown) {
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
      data: data,
      destroy: true,
      columns: [{
        targets: 0,
        responsivePriority: -1,
        data: null,
        render: function render(data, type, row, meta) {
          return i++;
        }
      }, {
        data: "name"
      }, {
        data: "price"
      }, {
        targets: -1,
        orderable: false,
        data: null,
        render: function render(data, type, row, meta) {
          return "<button type='button' class='btn btn-success btn-update btn-sm mr-2' data-id=".concat(data._id, "> <i class=\"fa-solid fa-pen-to-square\"></i> </button>\n                    <button type='button' class='btn btn-danger btn-delete btn-sm' data-id=").concat(data._id, "> <i class=\"fa-solid fa-trash-can\"></i> </button>");
        }
      }]
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
      data: {
        name: name,
        price: price
      },
      success: function success(result) {
        $("#errorMessage").html("");
        $("#errorAlert").hide();
        $("#productName").val("");
        $("#productPrice").val("");
        $('#productModal').modal('hide');
        swal("Success", "Prodcut insert successfully", "success");
        loadTableData();
      },
      error: function error(jqXHR, textStatus, errorThrown) {
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
      url: "/product/".concat(id),
      type: "GET",
      success: function success(result) {
        $("#productModalLabel").html("Update product");
        $("#productName").val(result.data.name);
        $("#productPrice").val(result.data.price);
      },
      error: function error(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseJSON);
        var errorMessage = jqXHR ? jqXHR.responseJSON.message : "";
        swal("Error", errorMessage ? errorMessage : "Something went wrong while fetching data", "error");
      }
    });
  });
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
      url: "/product/".concat(id),
      type: "PUT",
      data: {
        name: name,
        price: price
      },
      success: function success(result) {
        $("#errorMessage").html("");
        $("#errorAlert").hide();
        $("#productName").val("");
        $("#productPrice").val("");
        $('#productModal').modal('hide');
        swal("Success", "Prodcut updated successfully", "success");
        loadTableData();
      },
      error: function error(jqXHR, textStatus, errorThrown) {
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
    var _this = this;

    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this product!",
      icon: "warning",
      buttons: true,
      dangerMode: true
    }).then(function (willDelete) {
      if (willDelete) {
        var id = $(_this).data('id');
        $.ajax({
          url: "/product/".concat(id),
          type: "DELETE",
          success: function success(result) {
            swal({
              title: "Success",
              text: "Product deleted successfully",
              icon: "success"
            });
            loadTableData();
          },
          error: function error(jqXHR, textStatus, errorThrown) {
            var errorMessage = jqXHR ? jqXHR.responseJSON.message : "";
            swal("Error", errorMessage ? errorMessage : "Something went wrong while deleting product", "error");
          }
        });
      }
    });
  });
});

/***/ }),

/***/ "./src/resources/js/flickr/flickr.js":
/*!*******************************************!*\
  !*** ./src/resources/js/flickr/flickr.js ***!
  \*******************************************/
/***/ (() => {

$(document).ready(function () {
  if (window.location.href.includes('flickr')) {
    var flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=landscape&per_page=20&";
    $.ajax({
      url: flickerAPI,
      dataType: "jsonp",
      jsonpCallback: 'jsonFlickrFeed',
      success: function success(result, status, xhr) {
        $.each(result.items, function (i, item) {
          $("<div>").attr("id", "image-wrapper-" + i).attr("class", "image-wrapper").appendTo("#results");
          $("<img>").attr("src", item.media.m).appendTo("#image-wrapper-" + i);
        });
      },
      error: function error(xhr, status, _error) {
        console.log(xhr);
      }
    });
  }
});

/***/ }),

/***/ "./src/resources/scss/style.scss":
/*!***************************************!*\
  !*** ./src/resources/scss/style.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/src/public/js/app": 0,
/******/ 			"src/public/css/style": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunktest_1"] = self["webpackChunktest_1"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["src/public/css/style"], () => (__webpack_require__("./src/resources/js/app.js")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["src/public/css/style"], () => (__webpack_require__("./src/resources/scss/style.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;