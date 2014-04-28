var path = require('path');

module.exports = function (grunt) {

  grunt.initConfig({

    express: {
      dev: {
        options: {
          port: 3000,
          hostname: undefined,
          server: path.resolve('app')
        }
      }
    },

    watch: {
      reload: {
        files: [ 'app.js', 'routes.js', 'public/**/*', 'config.js', 'views/**/*', 'controllers/**/*', 'models/**/*' ],
        options: {
          livereload: true
        }
      }
    },

    copy: {
      main: {
        files: [
          { expand: true, flatten: true, src: ['bower_components/jquery/dist/jquery.min.js'], dest: 'public/js/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['bower_components/bootstrap/dist/js/bootstrap.min.js'], dest: 'public/js/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['bower_components/bootstrap/dist/css/bootstrap.min.css'], dest: 'public/css/', filter: 'isFile' },
          { expand: true, flatten: true, src: ['bower_components/bootstrap/dist/fonts/*'], dest: 'public/fonts/' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', [ 'copy:main', 'express', 'watch']);
};