define([], function () {

    var live_api_url = '//theribots.nodejitsu.com/api/',
        alt_live_api_url = '//riapi.eu01.aws.af.cm/api/',
        local_api_url = '//'+window.location.hostname+':25708/api/';

    return {
        riAPI_url: alt_live_api_url,
        overflow_scrolling: false
    };
});