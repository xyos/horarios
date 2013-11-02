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
  var scheduleValue = {"busy": [0, 0, 0, 0, 0, 0, 0], "groups": [["1", [0, 0, 0, 0, 0, 0, 0]], ["1", [0, 0, 0, 0, 0, 0, 0]], ["1", [0, 0, 0, 0, 0, 0, 0]]]};
  return {
    getSchedule : function() {
      return scheduleValue;
    },
    setSchedule : function(schedule){
      console.log(schedule);
      console.log("changed schedulle");
      scheduleValue = schedule;
    }
  }
});
