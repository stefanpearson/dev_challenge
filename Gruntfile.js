module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-handlebars');

    grunt.initConfig({

        handlebars: {
            compile: {
                options: {
                    namespace: 'templates',
                    amd: true
                },
                files: {
                    "public/views/compiled/templates.js": ["public/views/templates/*.handlebars"]
                }
            }
        }

    });

    grunt.registerTask('precompile', ['handlebars']);

};