define(['modules/lazy_image', 'modules/comm', 'modules/templates', 'zepto', 'require'], function (LazyImage, comm, templates, $, require) {

    /*
        Section module
    */

    // Constructor
    var Section = function ($section, url) {

        var t = this;

        t.$parent = $('.section-list');
        t.$section = $section;
        t.$back = $section.find('.section__title');
        t.$body = $section.find('.section__body');
        t.url = url;

        t.current_request = null;
    };
    Section.prototype = {

        $window: $(window),

        activate: function () {

            var t = this,
                offset = -(t.$section.offset().top - 40),
                defer;

            t.make_request();

            t.add_events();

            t.$section.css({
                '-webkit-transform': 'translate3d(0,' + offset + 'px, 0)'
            });

            t.$section.addClass('is-active');
        },

        deactivate: function () {

            var t = this;

            t.remove_events();

            if (t.current_request !== null)
            {
                t.current_request.abort();
            }

            t.$body.empty();

            t.$section.css({
                '-webkit-transform': 'translate3d(0,0,0)'
            });

            t.$section.removeClass('is-active is-ready');
        },

        make_request: function () {

            var t = this;

            t.current_request = comm.request({
                url: this.url,
                done: function (data) {
                    t.on_response(data);
                },
                always: function () {
                    t.current_request = null;
                }
            });
        },

        on_response: function (data) {

            var t = this,
                $html = t.render(data, t.$body),
                defer;

            defer = setTimeout(function () {
                t.$section.addClass('is-ready');
                var $images = $html.find('.image');

                $images.each(function (index, value) {
                    var image = new LazyImage($(this), value.dataset.src);
                    image.load();
                });
            }, 1);
        },

        render: function (data, $target) {

            var $html;

            // Augment data
            data.ribotarURL = this.url + '/ribotar/';

            // Render
            $html = $(templates['member_profile'](data));

            // Append to target
            if ($target !== undefined && $target.length)
            {
                $target.append($html);
            }

            return $html;
        },

        add_events: function () {

            var t = this;

            t.$back.on('click', function () {
                var view_manager = require('modules/view_manager');
                view_manager.go_to_menu();
            });
        },

        remove_events: function () {

            var t = this;

            t.$back.off('click');
        }

    };

    return Section;
});