module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-requirejs');

    grunt.initConfig({

        requirejs: {
            compile: {
                options: {
                    //almond: true,
                    optimize: 'uglify2',
                    baseUrl: './client',
                    out: './public/js/build.js',
                    include: ['main'],
                    insertRequire: ['main'],
                    paths: {
                        zepto: 'libs/zepto'
                    },
                    wrap: true
                }
            }
        },

        webfont: {
            icons: {
                src: 'production_assets/icons/*.svg',
                dest: 'public/fonts',
                destCss: 'less/icons',
                options: {
                    font: 'icons_font',
                    hashes: false,
                    stylesheet: 'less',
                    htmlDemo: false
                }
            }
        }

    });

};