// Libraries
var express = require('express'),
    express_handlebars = require('express3-handlebars'),
    routes = require('./application/routes');

// Vars
var app = express(),
    port = 8080,
    hbs = express_handlebars.create({
        layoutsDir: './views/',
        partialsDir: './views/',
        defaultLayout: 'shell',
        helpers: {
            base_url: function () {
                return '/';
            }
        }
    });

// Setup
app.use(express.compress());
app.use(express.static(__dirname + '/public'));
app.engine('handlebars', hbs.engine);
app.set('views', './views/');
app.set('view engine', 'handlebars');

// Routes
app.get('/', routes['/']);

// Start
app.listen(port);