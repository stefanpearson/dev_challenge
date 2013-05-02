define(['modules/document'], function (document) {

    /*
        Language module, for any idiom required in the UI
    */

    // Languages
    var languages = {

        // English
        'en': {
            fav_sweet_label: '<b>Sweet</b> of choice',
            fav_season_label: '<b>Season</b> of choice'
        }

    };

    // Idiom returns language hash using HTML lang attribute
    var idiom = (function () {
        var lang_attr = document.documentElement.getAttribute('lang');
        return languages[lang_attr] || languages.en;
    })();

    // Exports
    return idiom;
});
