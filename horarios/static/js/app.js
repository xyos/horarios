/**
 * bootstraps angular onto the window.document node
 */
define([
  'angular',
  'angular-ui-router',
  'angular-bootstrap',
  './app/subject/index'
], function(ng) {
  'use strict';
  return ng.module('app',[
    'ui.router',
    'ui.bootstrap',
    'app.subject'
  ]);
});
