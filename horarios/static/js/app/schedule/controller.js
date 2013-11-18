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

    /*
     * this will throttle the schedule change event to make it wait half a second
     */
    var throttle = function(func, wait) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        if (!timeout) {
          // the first time the event fires, we setup a timer, which 
          // is used as a guard to block subsequent calls; once the 
          // timer's handler fires, we reset it and create a new one
          timeout = setTimeout(function() {
            timeout = null;
            func.apply(context, args);
          }, wait);
        }
      };
    };
    /*
     * refresh the view after a subject is changed
     */
    $rootScope.$on('scheduleChange', function(){
      console.log('fireds');
      throttle(ScheduleService.fetch(), 5000);
    });

  });
});
