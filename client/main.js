define(['modules/view_manager', 'libs/fastclick'], function (view_manager, FastClick) {

    // Click event override to remove touch delay
    new FastClick(document.body);

    // Go to menu
    view_manager.go_to_menu();

    // w00t
    console.log('App initialised');
});
