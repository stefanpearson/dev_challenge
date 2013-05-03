define(['modules/view_manager', 'modules/settings', 'libs/fastclick'], function (view_manager, settings, FastClick) {

    // Click event override to remove touch delay
    new FastClick(document.body);

    // Enable overflow scrolling (experimental)
    if (settings.overflow_scrolling)
    {
        $('.bounds').addClass('bounds--overflow-scrolling');
    }

    // Show splash
    view_manager.show_splash();

    // w00t
    console.log('App initialised');
});
