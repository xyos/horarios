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
    { code : "no hay horario", schedule :  [
         33554431, 33554431, 33554431, 33554431, 33554431 ,33554431, 33554431] , subject : "no hay horario", name : ""}
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
    'concrete',
    'orange',
    'pumpkin',
    'pomegranate',
    'asbestos'
  ];
  return {
    getSubjectColor : function(code){
      if(assignedColors[code] == undefined){
        var rand = Math.floor(Math.random() * colors.length);
        var randcolor = colors[rand];
        assignedColors[code] = randcolor;
        colors.splice(rand,1);
      }
      return assignedColors[code];
    },
    freeColor : function(code){
      colors.push(assignedColors[code]);
      delete assignedColors[code];
    }
  }
});
