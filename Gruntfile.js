module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-webfont');

    grunt.initConfig({

        handlebars: {
            compile: {
                options: {
                    namespace: 'Handlebars.templates',
                    amd: true,
                    processName: function (filename) {
                        filename = filename.replace('views/shared/', '');
                        filename = filename.substring(0, filename.lastIndexOf('.'));
                        return filename;
                    }
                },
                files: {
                    'client/modules/templates.js': ['views/shared/*.handlebars', 'views/shared/fragments/*.handlebars']
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    //almond: true,
                    //optimize: 'uglify2',
                    optimize: 'none',
                    baseUrl: './client',
                    out: './public/js/build.js',
                    include: ['main'],
                    insertRequire: ['main'],
                    paths: {
                        zepto: 'libs/zepto',
                        handlebars: 'libs/handlebars'
                    },
                    wrap: true
                }
            }
        },

        webfont: {
            icons: {
                src: 'production_assets/icons/*.svg',
                dest: 'public/fonts',
                destCss: 'less/components',
                options: {
                    font: 'icons_font',
                    hashes: false,
                    stylesheet: 'less',
                    htmlDemo: false
                }
            }
        }

    });

    grunt.registerTask('build', ['handlebars', 'requirejs']);

};