/// <binding AfterBuild='build' />
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
        libs: {
            files: [{
                src: ["../node_modules"],
                dest: 'libs.js',
                options: {
                    shim: {
                        jquery: {
                            path: "../node_modules/jquery",
                            exports: "$"
                        },
                        materialize: {
                            path: "../node_modules/materialize",
                            exports: "materialize"
                        },
                    },
                    debug: true,
                    transform: ['browserify-shim'],
                },
            }],
        },
        client: {
            files: [{
                external: { jquery: 'jquery', materialize: 'materialize' },
                src: ['src/default.js'],
                dest: './app.js',
                options: {
                    browserifyOptions: {
                        debug: true,
                    },
                    transform: ['reactify']
                },
            }],
        }
    },
    concat: {
        'bundle.js' : ['modules.js', 'app.js']
    } ,
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', 'components/**/*.js','test/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    jsbeautify: {
        default_options: {
            options: {
                end_with_newline: true,
                max_preserve_newlines: 1
            },
            files: {
                'application_files': ['src/**/*.js']
            }
        }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['jshint', 'jsbeautify']);
  grunt.registerTask('build', ['browserify', 'concat']);
  grunt.registerTask('debug', ['browserify']);
};