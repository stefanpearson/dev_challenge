define(['modules/document'], function (document) {

    /*
        Language module, for any idiom required in the UI
    */

    // Languages
    var languages = {

        // English
        'en': {
            hello: 'hello'
        }
    };

    // Idiom returns language hash using HTML lang attribute
    var idiom = (function () {
        var lang_attr = document.getElementsByTagName('head')[0].getAttribute('lang');
        return languages[lang_attr] || languages.en;
    })();

    // Exports
    return idiom;
});
