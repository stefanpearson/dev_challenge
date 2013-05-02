define(['modules/lazy_image', 'modules/comm', 'zepto'], function (LazyImage, comm, $) {

    /*
        Section module
    */

    // Constructor
    var Section = function ($el) {

        this.$el = $el;
    };
    Section.prototype = {

        make_request: function (url) {

            return comm.request({
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
        },

        render: function () {

        },

        activate: function () {

        },

        deactivate: function () {

        }

    };

    return Section;
});