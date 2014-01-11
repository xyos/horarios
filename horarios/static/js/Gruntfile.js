'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // cleaning the tmp files
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
    //adding templates to javascript file
    ngtemplates:{
      app: {
        src: '../partials/*.html',
        dest: 'tmp/templates.js'
      }
    },
    //concat templates and main file
    concat: {
      build: {
        src: ['tmp/main-annotate.js','tmp/templates.js'],
        dest: 'tmp/main-built.js'
      }
    },
    // compressing and mangling
    uglify: {
      options: {
        mangle: false
      },
      main: {
        files: {
          'main-built.js' : ['tmp/main-built.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.registerTask('default',['clean','shell','ngmin','ngtemplates','concat','uglify']);
}

