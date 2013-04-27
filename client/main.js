define(['modules/idiom', 'modules/comm'], function (idiom, comm) {

    //var riAPI_url = 'http://theribots.nodejitsu.com/api/';
    var riAPI_url = 'http://localhost:25708/api/';

    var request = comm.request({
        url: riAPI_url + 'team/',
        done: function (data) {
            console.log(data);
        }
    });

});
