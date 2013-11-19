/**
* Schedule controller definition
* @scope Controllers
*/
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('ScheduleDetailCtrl', function ($scope, $rootScope, ScheduleService) {
    $scope.schedule = ScheduleService.getActive();
    /*
     * refresh the view after a subject is changed
     */
    $rootScope.$on('activeScheduleChange', function(event){
      console.log(ScheduleService.getActive());
      ScheduleService.getActive().parseRows();
      $scope.schedule = ScheduleService.getActive();
    });

  });
  controllers.controller('ScheduleListCtrl', function ($scope, $rootScope, ScheduleService) {
    /*
     * retrieves the schedules from the service
     */
    $scope.schedules = ScheduleService.getList();
    $scope.$watch('ScheduleService.getList()', function(newVal, oldVal) {
      $scope.schedules = newVal;
    });
    $scope.loadSchedule = function(index){
      ScheduleService.setActive(index);
      $scope.$emit('activeScheduleChange');
    };
    /*
     * refresh the view after a subject is changed
     */
    $rootScope.$on('scheduleChange', function(event, query){
      ScheduleService.fetch(query);
      $scope.schedules = ScheduleService.getList();
    });
  });
});
