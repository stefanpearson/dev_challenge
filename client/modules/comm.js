define(['modules/request_store', 'modules/ajax', 'zepto'], function (request_store, comm_interface, $) {

    /*
        Comm façade
    */

    // Returns request key, to allow for the option to abort the request
    var request = function (request_params) {

        var request_object,
            request_key;

        if (request_params.hasOwnProperty('url'))
        {
            request_object = comm_interface.request($.extend({
                data: {},
                type: 'GET',
                dataType: 'json',
                beforeSend: function () {},
                always: function () {},
                done: function () {},
                fail: function () {}
            }, request_params));

            request_key = request_store.register(request_object);

            return request_key;
        }
        else
        {
            console.log('Comm: Request requires URL');
            return false;
        }
    };

    // Abort a given request key, unregister it from the store
    var abort = function (request_key) {

        request_store.get(request_key).abort();
        request_store.unregister(request_key);
    };

    // Exports
    return {
        request: request,
        abort: abort
    };
});
