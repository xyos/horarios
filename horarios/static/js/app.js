/**
 * bootstraps angular onto the window.document node
 */
define([
  'angular',
  'angular-ui-router',
  './app/subject/index'
], function(ng) {
  'use strict';
  return ng.module('app',[
    'ui.router',
    'app.subject'
  ]);
});
