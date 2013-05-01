define(['modules/section', 'modules/comm', 'modules/templates'], function (Section, comm, templates) {

    //var riAPI_url = 'http://theribots.nodejitsu.com/api/';
    var riAPI_url = '//' + window.location.hostname + ':25708/api/';

    /*
        Menu
    */

    var init = function () {

        // Make request
        var team_request = comm.request({
            url: riAPI_url + 'team/',
            done: render
        });
    };

    var render = function (data) {

        var html = templates['team'](data);

        $('.bounds').append(html);
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