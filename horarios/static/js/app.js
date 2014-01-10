/**
 * bootstraps angular onto the window.document node
 */
define([
  'angular',
  'uiRouter',
  'angularBootstrap',
  'ngProgress',
  './app/subject/index',
  './app/schedule/index'
], function(ng) {
  'use strict';
  return ng.module('app',[
    'ui.router',
    'ui.bootstrap',
    'app.schedule',
    'app.subject',
    'ngProgress'
  ]);
});
