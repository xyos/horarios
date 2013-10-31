'use strict';

angular.module('schedulesApp')
.controller('TypeaheadCtrl', function ($scope, $http, limitToFilter) {
  $scope.subjects = function(subjectName){
    return $http.get('/api/v1.0/subject/autocomplete/' + subjectName + "/?format=json")
    .then(function(response){
      console.log(limitToFilter(response.data,15));
      return limitToFilter(response.data,15);
    });
  }
});

