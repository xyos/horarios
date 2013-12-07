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
      $scope.changeGroup();
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
    /*
     * changes the check status for the given children
     */
    $scope.checkChange = function(items,value, isChild){
      items.forEach(function(item){
        item.isChecked = value;
        if(item.hasOwnProperty('groups')){
          $scope.checkChange(item.groups,value,true);
        }
      });
      if ( isChild === undefined ) {
        $scope.changeGroup();
      }
    };
    /*
     * toggles the group and emits the scheduleChange event
     */
    var emit = function() {
      $scope.$emit('scheduleChange', SubjectService.getQuery());
    };
    /*
     * Formats the input on the typeahead
     */
    $scope.formatInput = function(model){
          return "";
    }
    $scope.changeGroup = function(){
      var throttledEmit = _.throttle(emit, 1000, { 'leading': false, 'trailing': true });
      throttledEmit();
    };
  });
});
