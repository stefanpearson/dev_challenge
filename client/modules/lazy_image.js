define(['zepto'], function () {

    /*
        Lazy image
        Instantiate with new operator; then call load, when required
    */

    // Constructor
    var LazyImage = function ($image, src) {

        this.$image = $image;
        this.src = src;

        return this;
    };
    LazyImage.prototype = {

        load: function () {

            var $dummy = $('<img />');

            // Preload image, callback show or error
            $dummy.one('load', $.proxy(this.show, this));
            $dummy.one('error', $.proxy(this.error, this));
            $dummy.attr('src', this.src);
        },

        show: function () {

            this.$image.css({'background-image': 'url(' + this.src + ')'});
            this.$image.addClass('is-ready');
        },

        error: function () {

            this.$image.addClass('is-fallback is-ready');
        }

    };

    return LazyImage;
});