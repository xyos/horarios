'use strict';

angular.module('schedulesApp')
.controller('SubjectsCtrl', function($scope, $http, limitToFilter) {
  $scope.selectedSubjects = [];
  $scope.subjects = function(subjectName){
    return $http.get('/api/v1.0/subject/autocomplete/' + subjectName + "/?format=json")
    .then(function(response){
      console.log(limitToFilter(response.data,15));
      return limitToFilter(response.data,15);
    });
  };
  $scope.onSelect = function ($item, $model, $label) {
    $scope.selectedSubjects.push($item);
  }
})
.controller('ScheduleDetailCtrl',function($scope, $http){
  $scope.daysOfWeek =
    ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  $scope.hours = [];
  for (var i = 6; i < 22; i++) {
    $scope.hours.push(i + ":00");
  };
});
