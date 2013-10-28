'use strict';

angular.module('schedulesApp', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ui.bootstrap',
  'ngSanitize'
]).run(['$rootScope','$state','$stateParams',
  function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
  }
]);
