'use strict';

/**
* Subject controller definition
* @scope Controllers
*/
define(['./module'], function (models) {
  'use strict';
  models.factory('Schedule', function ($http, SubjectService) {
    var daysOfWeek = 
      ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    var hours = [];
    for (var i = 1; i <= 24; i++) {
      hours.push(i -1 + ":00 - " + i + ":00");
    };

    var Schedule = function(scheduleItems){
      var schedule = {};
      /*
       * defining some constants
       */
      var dayHeaders = [{text : 'hora', class : 'heading'}];
      daysOfWeek.forEach(function(item){
        dayHeaders.push({text : item, class : 'heading'});
      });
      schedule.push(dayHeaders);

      /*
       * adding the heading zeros and transforming the values to binary for the
       * busy array
       */
      var busyArray = [];

      scheduleItems.busy.forEach(function(item){
        busyArray.push(( item + Math.pow(2,25) ).toString(2).substring(1));
      });

      var groupsArray = [];

      scheduleItems.groups.forEach(function(group,index){
        var groupHours = [];
        group.schedule.forEach(function(item){
          groupHours.push(( item + Math.pow(2,25) ).toString(2).substring(1));
        });
        g = SubjectService.getByCode(group.subject);
        groupsArray.push({
          text: (group.subject + '-' + group.code),
          hours: groupHours,
          class: g.color
        });
      });

      for (var i = 0; i < hours.length; i++) {
        var row = [];
        row.push({text : hours[i], class : 'heading'});
        for (var j = 0; j < daysOfWeek.length; j++) {
          //adding busy hours
          var rowGroupsText = "";
          var busyGroups = false;
          groupsArray.forEach(function(item){
            if (item.hours[j][i] == "1"){
              rowGroupsText += item.text;
              busyGroups = busyGroups || true;
            } 
          });
          var rowText = ( (busyArray[j][i] == "1") ? "ocupado" : "" );
          var rowBusy = ( (busyArray[j][i] == "1" || busyGroups) ? 1 : 0 );
          rowText += rowGroupsText;
          row.push({
            text: rowText,
            busy: busyArray,
            class: "busyHour"
          });
        };
        schedule[i+1] = row;
      };
      return schedule;
    };
  });
});
