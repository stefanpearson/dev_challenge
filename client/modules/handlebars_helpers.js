define(['modules/idiom', 'handlebars'], function (idiom, Handlebars) {

    Handlebars.registerHelper('compare', function (lvalue, rvalue, options) {

        if (arguments.length < 3)
        {
            throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
        }

        var operator = options.hash.operator || "==",
            operators = {},
            result,
            return_val;

        operators = {
            '==':       function(l,r) { return l == r; },
            '===':      function(l,r) { return l === r; },
            '!=':       function(l,r) { return l != r; },
            '!==':      function(l,r) { return l != r; },
            '<':        function(l,r) { return l < r; },
            '>':        function(l,r) { return l > r; },
            '<=':       function(l,r) { return l <= r; },
            '>=':       function(l,r) { return l >= r; },
            'typeof':   function(l,r) { return typeof l == r; }
        };

        if (! operators[operator])
        {
            throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
        }

        result = operators[operator](lvalue,rvalue);

        return_val = (result ? options.fn(this) : options.inverse(this));

        return return_val;
    });

    Handlebars.registerHelper('idiom', function (key) {

        return idiom[key];
    });

    return Handlebars;
});
