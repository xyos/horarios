/**
* Schedule controller definition
* @scope Controllers
*/
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('ScheduleDetailCtrl', function ($scope, $rootScope, ScheduleService) {
    $scope.daysOfWeek =
      ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    $scope.hours = [];
    for (var i = 1; i <= 24; i++) {
      $scope.hours.push(i -1 + ':00 - ' + i + ':00');
    }
    $scope.schedule = ScheduleService.getActive();
    $scope.$watch('ScheduleService.getActive()', function(newVal, oldVal) {
      $scope.schedules = newVal;
    });
    /*
     * Shows if a row should be shown or not depends on the early, late hours
     */
    $scope.showRow = function(index){
      if(index >= 0 && index < 7) {
        return false;
      } 
      else if (index >= 20 && index < 24) {
        return false;
      } else {
        return true
      };
    }
    /*
     * refresh the view after a subject is changed
     */
    $rootScope.$on('activeScheduleChange', function(event){
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
      ScheduleService.fetch(query).then(function(){
        $scope.schedules = ScheduleService.getList();
        ScheduleService.setActive(0);
        $scope.$emit('activeScheduleChange');
      });
    });
  });
});
