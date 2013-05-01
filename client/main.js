define(['modules/menu', 'libs/fastclick'], function (menu, FastClick) {

    //var riAPI_url = 'http://theribots.nodejitsu.com/api/';
    var riAPI_url = '//' + window.location.hostname + ':25708/api/';

    new FastClick(document.body);

    menu.init();

    console.log('App initialised');
});
