module.exports = {

    '/': function (request, response) {
        response.render('main', {
            title: 'Ribot Dev Challenge'
        });
    }

};