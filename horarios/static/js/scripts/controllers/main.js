'use strict';

angular.module('schedulesApp')
  .controller('TypeaheadCtrl', function ($scope, $http, limitToFilter) {
    $scope.schedules = function(subjectName){
      $http({
        method : "POST",
        url : "http://127.0.0.1:8000/json/subject",
        data : JSON.stringify({"name": subjectName}),
        contentType: "application/json; charset=utf-8"}).then(function(response){
          return limitToFilter(response.data, 15);
        });
      }
  });

