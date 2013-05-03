define(['modules/section', 'modules/menu'], function (Section, menu) {

    /*
        View mediator
        Manages views
    */

    var active_view = null;

    var go_to_section = function ($section, url) {

        // To do: Check to see if already exists (from element id?) Only instantiate if necessary
        var section = new Section($section, url);
        update(section);
    };

    var go_to_menu = function () {

        update(menu);
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
        go_to_menu: go_to_menu,
        go_to_section: go_to_section
    };
});