define(['modules/section', 'modules/comm', 'modules/templates'], function (Section, comm, templates) {

    /*
        Menu
    */

    //var riAPI_url = 'http://theribots.nodejitsu.com/api/';
    var riAPI_url = '//' + window.location.hostname + ':25708/api/',
        $menu = null;

    var init = function () {

        // Make request
        var team_request = comm.request({
            url: riAPI_url + 'team/',
            done: function (data) {
                var html = render(data);

                $menu = $(html);
                $('.bounds').append($menu);
                add_events();
            }
        });
    };

    var render = function (data) {

        return templates['team'](data);
    };

    var add_events = function () {

        $menu.on('click', '.section', tap_handler);
    };

    var remove_events = function () {

        $menu.off('click', '.section', tap_handler);
    };

    var tap_handler = function (e) {

        var el = e.currentTarget,
            $el = $(el),
            url = el.dataset.url;

        console.log(url);

        remove_events();
    };

    /*
    $menu = $('.section-list');

        $menu.on('click', '.section', function (e) {

            var el = e.currentTarget,
                $el = $(el),
                url = el.dataset.url,
                member_request;

            $el.addClass('is-active');

            member_request = comm.request({
                url: url,
                done: function (data) {
                    var html,
                        $images;

                    data.ribotarURL = url + '/ribotar/';
                    html = templates['member_profile'](data);

                    $el.find('.section__body').append(html);

                    setTimeout(function () {
                        $el.addClass('is-ready');
                        $images = $el.find('.image');

                        $images.each(function (index, value) {
                            var image = new LazyImage($(this), value.dataset.src);
                            image.load();
                        });
                    }, 1);
                    //$menu.off('click');
                }
            });
        });
    */

    // Exports
    return {
        init: init
    };
});