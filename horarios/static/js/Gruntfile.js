'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // cleaning the tmp files building we need to clean old files
    clean: {
      build: ['tmp']
    },
    // making requirejs concatenate the files
    shell: {
      requirejs : {
        command : 'r.js -o build.js'
      }
    },
    // pre-minifying angularjs files
    ngmin: {
      main: {
        src : 'tmp/main.js',
        dest : 'tmp/main-annotate.js'
      }
    },
    // compressing and mangling
    uglify: {
      options: {
        mangle: false
      },
      main: {
        files: {
          'main-built.js' : ['tmp/main-annotate.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default',['clean','shell','ngmin','uglify']);
}

