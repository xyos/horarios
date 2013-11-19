/**
* Schedule controller definition
* @scope Controllers
*/
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('ScheduleDetailCtrl', function ($scope, $rootScope, ScheduleService) {
  });
  controllers.controller('ScheduleListCtrl', function ($scope, $rootScope, ScheduleService) {
    /*
     * retrieves the schedules from the service
     */
    $scope.schedules = ScheduleService.getList();
    $scope.$watch('ScheduleService.getList()', function(newVal, oldVal) {
      $scope.schedules = newVal;
    });
    /*
     * refresh the view after a subject is changed
     */
    $rootScope.$on('scheduleChange', function(event, query){
      ScheduleService.fetch(query);
      $scope.schedules = ScheduleService.getList();
    });
  });
});
