'use strict';

angular.module('schedulesApp')
.controller('TypeaheadCtrl', function ($scope, $http, limitToFilter) {
  $scope.selectedSubjects = [];
  $scope.subjects = function(subjectName){
    return $http.get('/api/v1.0/subject/autocomplete/' + subjectName + "/?format=json")
    .then(function(response){
      console.log(limitToFilter(response.data,15));
      return limitToFilter(response.data,15);
    });
  };
  $scope.onSelect = function ($item, $model, $label) {
    console.log($item);
    $scope.selectedSubjects.push($item);
  }
});

