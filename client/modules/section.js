define(['modules/lazy_image', 'modules/comm', 'modules/templates', 'modules/settings', 'modules/document', 'zepto', 'require'], function (LazyImage, comm, templates, settings, document, $, require) {

    /*
        Section module
    */

    // Constructor
    var Section = function ($section, url) {

        var t = this;

        t.$parent = $('.section-list');
        t.$section = $section;
        t.$back = $section.find('.section__header');
        t.$body = $section.find('.section__body');
        t.url = url;

        t.current_request = null;
    };
    Section.prototype = {

        $window: $(window),

        activate: function () {

            var t = this,
                spacing = 36,
                offset,
                defer;

            t.make_request();

            t.add_events();

            t.$parent.addClass('is-engaged');

            if (settings.overflow_scrolling)
            {
                offset = -(t.$section.offset().top - spacing);
            }
            else
            {
                offset = -((t.$section.offset().top - spacing) - t.$window.scrollTop());
            }

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
                comm.abort(t.current_request);
            }

            t.$body.empty();

            t.$section.css({
                '-webkit-transform': 'translate3d(0,0,0)'
            });

            t.$parent.removeClass('is-engaged');
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

                // Instantiate lazy load images
                $images.each(function (index, value) {
                    var image = new LazyImage($(this), value.dataset.src);
                    image.load();
                });

                // Get tweets
                /*if (data.hasOwnProperty('twitter') && data.twitter.length)
                {
                    t.get_tweets(data.twitter, $html.find('.feed'));
                }*/
            }, 200);
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

        get_tweets: function (handle, $target) {

            var t = this;

            t.current_request = comm.request({
                url: document.documentElement.dataset['base-url'] + 'twitter/',
                data: {
                    user_id: handle,
                    count: 1
                },
                done: function (data) {
                    console.log(data);
                },
                always: function () {
                    t.current_request = null;
                }
            });
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