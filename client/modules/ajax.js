define(['zepto'], function ($) {

    /*
        Ajax module, via Zepto
    */

    var request = function (request_obj) {

        var ajax_obj = $.ajax({

            data: request_obj.data,
            type: request_obj.type,
            url: request_obj.url,
            dataType: request_obj.dataType,

            beforeSend: function (xhr, settings) {
                request_obj.beforeSend(xhr, settings);
            },

            complete: function () {
                request_obj.always();
            },

            success: function (data) {
                request_obj.done(data);
            },

            error: function (xhr, errorType, error) {
                request_obj.fail(xhr, errorType, error);
            }
        });

        return ajax_obj;
    };

    // Exports
    return {
        request: request
    };
});