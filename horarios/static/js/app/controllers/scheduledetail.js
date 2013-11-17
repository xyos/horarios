'use strict';

angular.module('schedulesApp')
.controller('ScheduleDetailCtrl',function($scope, $http, sharedSchedule, sharedColor){
  $scope.scheduleItems = sharedSchedule.getActiveSchedule();
  $scope.daysOfWeek =
    ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  $scope.hours = [];
  for (var i = 1; i <= 24; i++) {
    $scope.hours.push(i -1 + ":00 - " + i + ":00");
  };
  $scope.sharedSchedule = sharedSchedule;
  $scope.$watch('sharedSchedule.getActiveSchedule()', function(newValue){
    $scope.schedule = $scope.parseSchedule($scope.daysOfWeek, $scope.hours, newValue);
  });

})
