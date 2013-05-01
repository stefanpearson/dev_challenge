define(['zepto'], function ($) {
    
    /*
        Load indicator
    */

    // Constructor
    var LoadIndicator = function ($el, additional_classes) {

        var i = 0,
            classes_length = (additional_classes !== undefined ? additional_classes.length : 0);

        this.$el = $el;
        this.$loader = $('<div class="loader" />');

        for (; i < classes_length; ++i)
        {
            this.$loader.addClass(additional_classes[i]);
        }

        this.$el.append(this.$loader);

        this.show();
    };
    LoadIndicator.prototype = {

        show: function () {
            this.$loader.addClass('is-showing');
        },

        hide: function () {
            this.$loader.removeClass('is-showing');
        },

        kill: function () {
            this.$loader.remove();
            this.$el = null;
            this.$loader = null;
        }
    };

    return LoadIndicator;
});