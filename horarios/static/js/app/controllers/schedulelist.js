'use strict';

angular.module('schedulesApp')
.controller('ScheduleListCtrl',function($scope, $http, sharedSchedule, $q){
  $scope.schedules = {};
  $scope.sharedSchedule = sharedSchedule;
  $scope.$watch('sharedSchedule.getSchedules()', function(newValue){
    $scope.schedules = newValue;
  });
  $scope.loadSchedule = function(index){
    sharedSchedule.setActiveSchedule(index);
  }
});
