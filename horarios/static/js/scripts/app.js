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
  var schedulesValue = [{"busy": [0, 0, 0, 0, 0, 0, 0], "groups": [
    { code : "1", schedule :  [0, 0, 0, 0, 0, 0, 0] , subject : ""}
   ]}];
  var scheduleIndex = 0;
  return {
    getActiveSchedule : function() {
      return schedulesValue[scheduleIndex];
    },
    setActiveSchedule : function(schedule){
      scheduleIndex = schedule;
    },
    getSchedules : function() {
      return schedulesValue;
    },
    setSchedules : function(schedules){
      schedulesValue = schedules;
    }
  }
});
