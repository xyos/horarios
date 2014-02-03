/**
 * bootstraps angular onto the window.document node
 */
define([
  'require',
  'angular',
  'domReady',
  'lodash',
  './app',
  './app/routes',
  './app/template'
], function(require,ng) {
  'use strict';
  require(['domReady!','lodash'],function (document){
    ng.bootstrap(document, ['app']);
    ng.resumeBootstrap();
  });
});
