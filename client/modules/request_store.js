define([], function () {

    /*
        Current requests store
    */

    var counter = 0,
        hash_table = {};

    function make_key() {
        ++counter;
        return counter.toString();
    }

    var get = function (key) {
        return hash_table[key.toString()];
    };

    var register = function (value) {
        var key = make_key();
        hash_table[key] = value;
        return key;
    };

    var unregister = function (key) {
        delete hash_table[key.toString()];
    };

    // Exports
    return {
        get: get,
        register: register,
        unregister: unregister
    };
});
