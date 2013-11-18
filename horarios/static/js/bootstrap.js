/**
 * bootstraps angular onto the window.document node
 */
define([
  'require',
  'angular',
  './app',
  './app/routes'
], function(require,ng) {
  'use strict';
  require(['domReady!'],function (document){
    ng.bootstrap(document, ['app']);
    ng.resumeBootstrap();
  });
});
