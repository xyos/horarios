'use strict';

angular.module('schedulesApp')
  .controller('TypeaheadCtrl', function ($scope, $http, limitToFilter) {
    $scope.schedules = function(subjectName){
      $http({
        method : "GET",
        url : "/api/v1.0/subject/autocomplete/" + name + "/?format=json",
        contentType: "application/json; charset=utf-8"}).then(function(response){
          console.log(response.data);
          return limitToFilter(response.data, 15);
        });
      }
  });
