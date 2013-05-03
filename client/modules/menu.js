define(['modules/comm', 'modules/templates', 'zepto', 'require'], function (comm, templates, $, require) {

    /*
        Menu
    */

    //var riAPI_url = 'http://theribots.nodejitsu.com/api/',
    var riAPI_url = '//' + window.location.hostname + ':25708/api/',
        $el = $('.bounds'),
        $html = null,
        current_request = null,
        initialised = false;

    var activate = function () {
        if (! initialised)
        {
            make_request();
            initialised = true;
        }
        else
        {
            add_events();
            $html.addClass('is-engaged');
        }
    };

    var deactivate = function () {
        if (current_request !== null)
        {
            current_request.abort();
        }

        if ($html !== null)
        {
            $html.removeClass('is-engaged');
            remove_events();
        }
    };

    var make_request = function () {

        // Make request
        current_request = comm.request({
            url: riAPI_url + 'team/',
            done: on_response,
            always: function () {
                current_request = null;
            }
        });
    };

    var on_response = function (data) {

        $html = render(data, $el);

        add_events();
    };

    var render = function (data, $target) {

        var $html;

        // Generate html from template
        $html = $(templates['team'](data));

        // Append to target
        if ($target !== undefined && $target.length)
        {
            $target.empty().append($html);
        }

        return $html;
    };

    var add_events = function () {

        // Attach section tap handler
        $html.on('click', '.section', item_tap_handler);
    };

    var remove_events = function () {

        // Remove section tap handler
        $html.off('click', '.section', item_tap_handler);
    };

    var item_tap_handler = function (e) {

        var current_target = e.currentTarget,
            $item = $(current_target),
            view_manager = require('modules/view_manager');

        // Temp
        view_manager.go_to_section($item, current_target.dataset.url);
    };

    // Exports
    return {
        activate: activate,
        deactivate: deactivate
    };
});