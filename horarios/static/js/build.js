({
  baseUrl : ".",
  name: "main",
  out: './tmp/main.js',
  removeCombined: true,
  optimize:  'none',
  paths: {
    'domReady' : './libs/requirejs-domready/domReady',
    'angular' : './libs/angular/angular',
    'uiRouter' : './libs/angular-ui-router/release/angular-ui-router',
    'ngProgress' : './libs/ngprogress/build/ngProgress.min',
    'angularBootstrap' : './libs/angular-bootstrap/ui-bootstrap-tpls',
    'lodash' : './libs/lodash/dist/lodash'
  },
  shim: {
    'angular' : {
      exports: 'angular'
    },
    'domReady' : {
      deps: ['angular'],
      exports: 'domReady'
    },
    'lodash' : {
      exports: '_'
    },
    'angularUiRouter' : {
      deps: ['angular'],
      exports: 'uiRouter'
    },
    'angularBootstrap' : {
      deps: ['angular'],
      exports: 'angularBootstrap'
    },
    'ngProgress' : {
      deps: ['angular'],
      exports: 'ngProgress'
    }
  },
  priority : [
    'angular'
  ],
  deps : ['./bootstrap']
})
