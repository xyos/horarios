/**
* Subject controller definition
* @scope Controllers
*/
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('SubjectCtrl', function ($scope,SubjectService) {
    /*
     * lists all the currently selected subjects
     */
    $scope.subjects = SubjectService.get();
    /*
     * emits an event to rootScope when subjects are changed
     */
    $scope.$watchCollection('subjects', function() {
      console.log("$emit");
      $scope.$emit('scheduleChange');
    });
    /*
     * loads the autocomplete service
     */
    $scope.autocomplete = function(name){
      return SubjectService.autoComplete(name);
    };
    /*
     * adds a selected subject to the subjects list
     */
    $scope.onSelect  = function($item){
      SubjectService.add($item);
    };
    /*
     * removes a subject from the selected subjects
     */
    $scope.removeSubject = function(code){
      SubjectService.del(code);
    };
  });
});
