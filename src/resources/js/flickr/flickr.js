$(document).ready(function () {
    if (window.location.href.includes('flickr')) {

        const flickerAPI = "https://api.flickr.com/services/feeds/photos_public.gne?format=json&tags=landscape&per_page=20&";
        $.ajax({
            url: flickerAPI,
            dataType: "jsonp",
            jsonpCallback: 'jsonFlickrFeed',
            success: function (result, status, xhr) {
                $.each(result.items, function (i, item) {
                    $("<div>").attr("id", "image-wrapper-" + i).attr("class", "image-wrapper").appendTo("#results");
                    $("<img>").attr("src", item.media.m).appendTo("#image-wrapper-" + i);
                });
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            }
        });
    }
});