define(['modules/document', 'zepto'], function (document, $) {

    var touch_enabled = 'ontouchstart' in document.documentElement,
        $body = $('body');

    var disable_scroll = function () {

        if (touch_enabled)
        {
            $body.on('touchstart', function (e) {
                e.preventDefault();
            });
        }
        else
        {
            $body.addClass('is-locked');
        }
    };

    var enable_scroll = function () {

        if (touch_enabled)
        {
            $body.off('touchstart');
        }
        else
        {
            $body.removeClass('is-locked');
        }
    };

    return {
        disable_scroll: disable_scroll,
        enable_scroll: enable_scroll
    }; 
});