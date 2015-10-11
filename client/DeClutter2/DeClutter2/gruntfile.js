module.exports = function(grunt) {

  grunt.initConfig({
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

  grunt.registerTask('default', ['jshint', 'jsbeautify']);

};