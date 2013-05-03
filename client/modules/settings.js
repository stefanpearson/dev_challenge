define([], function () {

    var live_server = false;

    return {
        riAPI_url: (live_server ? '//theribots.nodejitsu.com/api/' : '//'+window.location.hostname+':25708/api/'),
        overflow_scrolling: false
    };
});