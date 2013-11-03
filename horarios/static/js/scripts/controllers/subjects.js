'use strict';

angular.module('schedulesApp')
.controller('SubjectsCtrl', function($scope, $http, limitToFilter, sharedSchedule) {
  $scope.selectedSubjects = [];
  $scope.subjects = function(subjectName){
    return $http.get('/api/v1.0/subject/autocomplete/' + subjectName + '/?format=json')
    .then(function(response){
      return limitToFilter(response.data,15);
    });
  };
  $scope.onSelect = function ($item, $model, $label) {
    $scope.selectedSubjects.push($item);
    var query = "";
    $scope.selectedSubjects.forEach(function(subject){
      query += subject.code.toString() + ",";
    })
    console.log(query);
    $http.get('/api/v1.0/schedule/subjects=' + query.substring(0,query.length-1) +'&busy=')
    .then(function(result){
      sharedSchedule.setSchedules(result.data);
    });
  }
});
