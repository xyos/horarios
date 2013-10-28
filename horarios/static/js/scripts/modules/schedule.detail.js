angular.module('schedule.detail')
  .constant(
    days : ["lunes","martes","miercoles","jueves","viernes","sabado","domingo"],
  )
  .controller('schedule.detailController',['$scope',function($scope){
  }])
  .directive('scheduledetail',[ 'schedule', function(schedule){
    return {
      restrict : 'EA',
      replace : 'true',
    }
  }]);
