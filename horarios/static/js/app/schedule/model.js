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
    /*
     * transpose an schedule matrix
     */
    var transpose = function(arr) {
      var trans = [];
      _.each(arr, function(row, y){
        _.each(row, function(col, x){
          if (!trans[x]) trans[x] = [];
          trans[x][y] = col;
        });
      });
      return trans;
    };

    var Schedule = function(schedItems){

      var parseRows = function(){
        var busyT = transpose(that.busy);
        console.log(busyT);
        //var groupsT = transpose(that.groups);
      }
      var that = this;
      angular.extend(this,{
        rows : [],
        toString: '',
        subjects: [],
        groups: [],
        busy: [],
        parseRows : parseRows
      });
      /*
       * lazy loading rows for better performance
       */

      var schedule = {};
      /*
       * defining some constants
       */
      var dayHeaders = [{text : 'hora', class : 'heading'}];

      daysOfWeek.forEach(function(item){
        dayHeaders.push({text : item, class : 'heading'});
      });
      /*
       * TODO: get the appropiate busy code here
       */
      var dummyBusy = [0,0,0,0,0,0,0];

      dummyBusy.forEach(function(item){
        that.busy.push(decimalToSchedString(item));
      });

      var groupsArray = [];
      schedItems.groups.forEach(function(group){
        var  s = [];
        group.schedule.forEach(function(item){
          s.push(decimalToSchedString(item));
        });
        var g = SubjectService.getByCode(group.subject);
        that.groups.push({subject: g.code, code: group.code, schedule : s});
        that.subjects.push(g);

      });
    };
    return Schedule;
  });
});
