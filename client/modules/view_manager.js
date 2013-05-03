define(['modules/section', 'modules/menu', 'modules/splash'], function (Section, menu, splash) {

    /*
        View mediator
        Manages views
    */

    var active_view = null;

    var show_splash = function () {

        update(splash);
    };

    var go_to_menu = function () {

        update(menu);
    };

    var go_to_section = function ($section, url) {

        // To do: Check to see if already exists (from element id?) Only instantiate if necessary
        var section = new Section($section, url);

        update(section);
    };

    var update = function (view) {

        var defer;

        if (active_view !== null)
        {
            active_view.deactivate();
        }

        defer = setTimeout(function () {
            view.activate();
        }, 0);

        active_view = view;
    };

    return {
        update: update,
        show_splash: show_splash,
        go_to_menu: go_to_menu,
        go_to_section: go_to_section
    };
});