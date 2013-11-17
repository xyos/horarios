/**
* Subject controller definition
* @scope Controllers
*/
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('SubjectCtrl', function ($scope,SubjectService) {
    /*
     * loads the autocomplete service
     */
    $scope.autocomplete = function(name){
      return SubjectService.autoComplete(name);
    }
    /*
     * adds a selected subject to the subjects list
     */
    $scope.onSelect  = function($item){
      SubjectService.add($item);
      console.log($scope.subjects);
    };
    /*
     * lists all the currently selected subjects
     */
    $scope.subjects = SubjectService.get();
    /*
     * removes a subject from the selected subjects
     */
    $scope.removeSubject = function(code){
      SubjectService.del(code);
    };
  });
});
