/// <binding AfterBuild='build' />
module.exports = function(grunt) {

    grunt.initConfig({
        browserify: {
        libs: {
            files: [{
                src: [],
                dest: 'modules.js',
                options: {
                    require: { jquery: 'jquery' },
                    browserifyOptions: {
                        debug: true,
                    },
                },
            }],
        },
        client: {
            files: [{
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