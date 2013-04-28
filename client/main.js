define(['modules/idiom', 'modules/comm', 'modules/templates', 'libs/fastclick', 'zepto'], function (idiom, comm, templates, FastClick, $) {

    //var riAPI_url = 'http://theribots.nodejitsu.com/api/';
    var riAPI_url = '//' + window.location.hostname + ':25708/api/';

    new FastClick(document.body);

    var team_request = comm.request({
        url: riAPI_url + 'team/',
        done: function (data) {

            var html = templates['team'](data),
                $menu = null;

            $('.bounds').append(html);

            $menu = $('.section-list');

            $menu.on('click', '.section', function (e) {

                var el = e.currentTarget,
                    url = el.dataset.url,
                    member_request;

                member_request = comm.request({
                    url: url,
                    done: function (data) {
                        data.ribotarURL = url + 'ribotar/';
                        var html = templates['member_profile'](data);
                        $(el).append(html);
                        $menu.off('click');
                    }
                });
            });
        }
    });

    console.log('App initialised');
});
