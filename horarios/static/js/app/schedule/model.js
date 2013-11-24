'use strict';

/**
* Subject controller definition
* @scope Controllers
*/
define(['./module'], function (models) {
  models.factory('Schedule', function ($http, SubjectService) {
    var HEADING_ONE = Math.pow(2,25);

    /*
     * transpose an schedule matrix
     */
    var transpose = function(arr, schedItem) {
      var trans = [];
      _.each(arr, function(row, x){
        _.each(row, function(col, y){
          if (!trans[y]) { trans[y] = [] };
          if (col === '1'){
            trans[y][x] = schedItem;
          } else {
            trans[y][x] = {};
          }
        });
      });
      return trans;
    };
    /*
     * concatenates 2 schedules
     * this does not validate the schedules
     */
    var sumMatrix = function(arr1, arr2) {
      _.each(arr1, function(col, x){
        _.each(col, function(row, y){
          if (!_.isEmpty(arr2[x][y])) {
            arr1[x][y] = arr2[x][y];
          }
        });
      });
      return arr1;
    };

    var Schedule = function(schedItems){

      var that = this;
      /*
       * adds the heading zeros and transforms the values to binary for the
       * busy array returns a string
       */
      var decimalToSchedString = function(value){

        that.earlyHours = (value & 127) > 0 || false || that.earlyHours;
        that.lateHours  = (value & 15728640) > 0 || false || that.lateHours;
        console.log( value  + "--" + that.earlyHours);
        return ( value + HEADING_ONE ).toString(2).substring(2).split('').reverse().join('');
      };

      var parseRows = function(){
        var scheduleMatrix = transpose(that.busy, { name : 'busy', class : 'busy'});
        _.each(that.groups, function(group){
          var gName = (_.isUndefined(group.subject)) ? 'no hay horario' : group.subject + '-' + group.code;
          var gClass = (_.isUndefined(group.color)) ? 'warning' : group.color;
          var schedT = transpose(group.schedule, {name: gName , color : gClass});
          scheduleMatrix = sumMatrix(scheduleMatrix, schedT);
        });
        that.rows = scheduleMatrix;


        //var groupsT = transpose(that.groups);
      };
      angular.extend(this,{
        rows: schedule,
        earlyHours: false,
        lateHours: false,
        toString: '',
        subjects: [],
        groups: [],
        busy: [],
        parseRows : parseRows
      });
      /*
       * lazy loading rows for better performance
       */
      var rows =  new Array(24);
      _.each(rows, function(row){
        row = [];
        var cols = new Array(7);
        row.push(cols);
      });
      var schedule = rows;
      /*
       * TODO: get the appropiate busy code here
       */
      var dummyBusy = [0,0,0,0,0,0,0];

      dummyBusy.forEach(function(item){
        that.busy.push(decimalToSchedString(item));
      });

      schedItems.groups.forEach(function(group){
        var  s = [];
        group.schedule.forEach(function(item){
          s.push(decimalToSchedString(item));
        });
        var g = SubjectService.getByCode(group.subject);
        that.groups.push({
          subject: g.code,
          code: group.code,
          schedule: s ,
          color: g.color,
          dept : g.departament
        });
        that.subjects.push(g);

      });
    };
    return Schedule;
  });
});
