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
  var blankSchedule = [{"busy": [0, 0, 0, 0, 0, 0, 0], "groups": [
    { code : "1", schedule :  [0, 0, 0, 0, 0, 0, 0] , subject : "", name : ""}
   ]}];
  var schedulesValue = blankSchedule;
  var scheduleIndex = 0;
  return {
    getActiveSchedule : function() {
      return schedulesValue[scheduleIndex];
    },
    setActiveSchedule : function(schedule){
      scheduleIndex = schedule;
    },
    resetSchedule : function() {
      schedulesValue = blankSchedule;
    },
    getSchedules : function() {
      return schedulesValue;
    },
    setSchedules : function(schedules){
      schedulesValue = schedules;
    }
  }
});
angular.module('schedulesApp')
.service('sharedColor',function(){
  var assignedColors = {};
  var colors = [
    'turquoise',
    'emerland',
    'peter-river',
    'amethyst',
    'wet-asphalt',
    'green-sea',
    'nephritis',
    'belize-hole',
    'wisteria',
    'midnight-blue',
    'sun-flower',
    'carrot',
    'alizarin',
    'clouds',
    'concrete',
    'orange',
    'pumpkin',
    'pomegranate',
    'silver',
    'asbestos'
  ];
  return {
    getSubjectColor : function(code){
      return 'sun-flower';
    }
  }
});
