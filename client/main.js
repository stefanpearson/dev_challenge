define(['modules/view_manager', 'modules/settings', 'libs/fastclick'], function (view_manager, settings, FastClick) {

    // Click event override to remove touch delay
    new FastClick(document.body);

    // Enable overflow scrolling (experimental)
    if (settings.overflow_scrolling)
    {
        $('.bounds').addClass('bounds--overflow-scrolling');
    }

    // Go to menu
    view_manager.go_to_menu();

    // w00t
    console.log('App initialised');
});
