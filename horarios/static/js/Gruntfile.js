'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // cleaning the tmp files
    clean: {
      build: ['tmp']
    },
    //adding templates to javascript file
    ngtemplates:{
      app: {
        cwd: '../../',
        src: 'static/partials/*.html',
        dest: 'app/template.js',
        options: {
          bootstrap: function (module, script) {
            return 'define(["../app"],function (templates) { "use strict"; templates.run(["$templateCache", function ($templateCache) {' + script + ' }]);});';
          },
          prefix: '/'
        }
      }
    },
    // making requirejs concatenate the files
    shell: {
      requirejs : {
        command : 'r.js.cmd -o build.js'
      }
    },
    // pre-minifying angularjs files
    ngmin: {
      main: {
        src : 'tmp/main.js',
        dest : 'tmp/main-annotate.js'
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
    },
    // watch config
    watch: {
      app: {
        files:['**/*.js', '../partials/*.html'],
        tasks:['default'],
        options: {
          spawn: false
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
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['clean','ngtemplates','shell','ngmin','concat','uglify']);

};

