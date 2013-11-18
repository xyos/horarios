'use strict';

/**
* Subject controller definition
* @scope Controllers
*/
define(['./module'], function (models) {
  models.factory('Schedule', function ($http, SubjectService) {
    var HEADING_ONE = Math.pow(2,25);
    var daysOfWeek =
      ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    var hours = [];
    for (var i = 1; i <= 24; i++) {
      hours.push(i -1 + ':00 - ' + i + ':00');
    }

    /*
     * adds the heading zeros and transforms the values to binary for the
     * busy array returns a string
     */
    var decimalToSchedString = function(value){
    return ( value + HEADING_ONE ).toString(2).substring(1);
    };

    var Schedule = function(schedItems){
      console.log(schedItems.busy);
      var schedule = {};
      /*
       * defining some constants
       */
      var dayHeaders = [{text : 'hora', class : 'heading'}];

      daysOfWeek.forEach(function(item){
        dayHeaders.push({text : item, class : 'heading'});
      });

      schedItems.busy.forEach(function(item){
        item = decimalToSchedString(item);
      });

      var groupsArray = [];
      schedItems.groups.forEach(function(group){

        group.schedule.forEach(function(item){
          item = decimalToSchedString(item);
        });

        var g = SubjectService.getByCode(group.subject);
        angular.extend(group, g);

      });
    };
    return Schedule;
  });
});
