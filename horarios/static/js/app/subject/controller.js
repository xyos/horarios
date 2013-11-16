/**
* Subject controller definition
* @scope Controllers
*/
define(['./module'], function (controllers) {
  'use strict';

  controllers.controller('SubjectCtrl', function ($scope) {
    $scope.twoTimesTwo = 2 * 2;
  });
});
