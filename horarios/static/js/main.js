'use strict';
require.config({
  paths: {
    'domReady' : './libs/requirejs-domready/domReady',
    'angular' : './libs/angular/angular',
    'angular-ui-router' : './libs/angular-ui-router/release/angular-ui-router',
    'ng-progress' : './libs/ngprogress/build/ngProgress.min',
    'angular-bootstrap' : './libs/angular-bootstrap/ui-bootstrap-tpls',
    'lodash' : './libs/lodash/dist/lodash'

  },
  shim: {
    'angular' : {
      exports: 'angular'
    },
    'angular-ui-router' : {
      deps: ['angular'],
      exports: 'angular-ui-router'
    },
    'angular-bootstrap' : {
      deps: ['angular'],
      exports: 'angular-bootstrap'
    },
    'ng-progress' : {
      deps: ['angular'],
      exports: 'ng-progress'
    }
  },
  priority : [
    'angular'
  ],
  deps : ['./bootstrap']
});
