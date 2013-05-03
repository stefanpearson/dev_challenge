define(['modules/templates', 'zepto', 'require'], function (templates, $, require) {

    var $el = $('.bounds'),
        $html = null,
        initialised = false;

    var activate = function () {

        var defer;

        if (!initialised)
        {
            $html = render($el);
        }

        add_events();

        $html.addClass('is-active');

        defer = setTimeout(function () {
            $html.addClass('is-showing');
        }, 0);
    };

    var deactivate = function () {

        remove_events();

        $html.removeClass('is-active is-showing');
    };

    var render = function ($target) {

        var $html;

        // Generate html from template
        $html = $(templates.splash());

        // Append to target
        if ($target !== undefined && $target.length)
        {
            $target.empty().append($html);
        }

        return $html;
    };

    var add_events = function () {

        $html.on('click', function (e) {
            var view_manager = require('modules/view_manager');

            view_manager.go_to_menu();
        });
    };

    var remove_events = function () {

        $html.off('click');
    };

    return {
        activate: activate,
        deactivate: deactivate
    };
});