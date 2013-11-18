/**
* Schedule controller definition
* @scope Controllers
*/
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('ScheduleDetailCtrl', function ($scope, $rootScope, ScheduleService) {
    /*
     * refresh the view after a subject is changed
     */
    $rootScope.$on('scheduleChange', function(){
      console.log('must reset');
    });
  });
  controllers.controller('ScheduleListCtrl', function ($scope,ScheduleService) {
  });
});
