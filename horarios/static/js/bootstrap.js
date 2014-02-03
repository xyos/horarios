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
  require(['domReady!','lodash','//www.google-analytics.com/analytics.js'],function (document){
    ng.bootstrap(document, ['app']);
    ng.resumeBootstrap();
    //TODO: make this configurable
    window.ga('create', 'UA-47728189-1');
    window.ga('send', 'pageview');
  });
});
