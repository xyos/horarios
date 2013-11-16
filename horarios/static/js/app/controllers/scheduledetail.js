'use strict';

angular.module('schedulesApp')
.controller('ScheduleDetailCtrl',function($scope, $http, sharedSchedule, sharedColor){
  $scope.scheduleItems = sharedSchedule.getActiveSchedule();
  $scope.daysOfWeek =
    ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  $scope.hours = [];
  for (var i = 1; i <= 24; i++) {
    $scope.hours.push(i -1 + ":00 - " + i + ":00");
  };
  $scope.parseSchedule = function(daysOfWeek, hours, scheduleItems){
    var schedule = [];
    var dayHeaders = [{text : 'hora', class : 'heading'}];
    daysOfWeek.forEach(function(item){
      dayHeaders.push({text : item, class : 'heading'});
    });
    schedule.push(dayHeaders);
    var busyArray = [];
    scheduleItems.busy.forEach(function(item){
      //adding a 1 to the decimal to keep the preeceding zeros
      busyArray.push(( item + Math.pow(2,25) ).toString(2).substring(1));
    });
    var groupsArray = [];
    scheduleItems.groups.forEach(function(group,index){
      var groupHours = [];
      group.schedule.forEach(function(item){
        groupHours.push(( item + Math.pow(2,25) ).toString(2).substring(1));
      });
      console.log(group);
      groupsArray.push({
        text: (group.subject),
        hours: groupHours,
        color: sharedColor.getSubjectColor(group.subject)
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
        var rowText = ( (busyArray[j][i] == "1") ? "" : "" );
        var rowBusy = ( (busyArray[j][i] == "1" || busyGroups) ? 1 : 0 );
        rowText += rowGroupsText;
        row.push({
          text: rowText,
          busy: busyArray,
          color: sharedColor.getSubjectColor(rowText)
        });
      };
      schedule[i+1] = row;
    };
    return schedule;
  };
  $scope.sharedSchedule = sharedSchedule;
  $scope.$watch('sharedSchedule.getActiveSchedule()', function(newValue){
    $scope.schedule = $scope.parseSchedule($scope.daysOfWeek, $scope.hours, newValue);
  });

})
