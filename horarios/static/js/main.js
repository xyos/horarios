'use strict;'
require.config({
  paths: {
    'domReady' : './libs/requirejs-domready/domready',
    'angular' : './libs/angular/angular',
    'angular-ui-router' : './libs/angular-ui-router/release/angular-ui-router'

  },
  shim: {
    'angular' : {
      exports: 'angular'
    },
    'angular-ui-router' : {
      deps: ['angular'],
      exports: 'angular-ui-router'
    }
  },
  priority : [
    "angular"
  ],
  deps : ['./bootstrap']
});
