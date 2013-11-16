'use strict';

var app = angular.module('schedulesApp', []);
angular.module('schedulesApp')
  .controller('MainCtrl', function($scope, subjectService){
    $scope.subject = subjectService.getByCode(2015139);
    console.log($scope.subject);
    $scope.$watch('subject',function(newVal){
      console.log('changed');
      $scope.subject = newVal;
    });
    console.log($scope.subject.teachers);
    $scope.subject2 = subjectService.getByCode(123456);
    console.log($scope.subject2);
  });
