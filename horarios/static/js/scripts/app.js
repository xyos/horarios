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

angular.module('schedulesApp')
.service('sharedSchedule',function(){
  var scheduleValue = {"busy": [0, 3264, 192, 3264, 192, 0, 0], "groups": [["1", [0, 0, 192, 0, 192, 0, 0]], ["1", [0, 3072, 0, 3072, 0, 0, 0]], ["1", [0, 192, 0, 192, 0, 0, 0]]]};
  return {
    getSchedule : function() {
      return scheduleValue;
    },
    setSchedule : function(schedule){
      scheduleValue = schedule;
    }
  }
});
