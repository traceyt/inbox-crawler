/// <binding AfterBuild='build' />
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            libs: {
                options: {
                    require: ['jquery', 'crypto', 'materialize'],
                    transform: ['browserify-shim'],
                debug: true
            },
            files: [{
                src: [],
                dest: 'libs.js',
            }],
        },
        client: {
            options: {
                external: ['jquery', 'crypto', 'materialize'],
                browserifyOptions: {
                    debug: true,
                },
                transform: ['reactify']
            },
            files: [{
                src: ['src/default.js'],
                dest: './app.js',
            }],
        }
    },
    concat: {
        'bundle.js' : ['lib.js', 'app.js']
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
  grunt.registerTask('build', ['browserify:client']);
  grunt.registerTask('debug', ['browserify']);
};