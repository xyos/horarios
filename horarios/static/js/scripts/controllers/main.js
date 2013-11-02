'use strict';

angular.module('schedulesApp')
.controller('SubjectsCtrl', function($scope, $http, limitToFilter) {
  $scope.selectedSubjects = [];
  $scope.subjects = function(subjectName){
    return $http.get('/api/v1.0/subject/autocomplete/' + subjectName + '/?format=json')
    .then(function(response){
      return limitToFilter(response.data,15);
    });
  };
  $scope.onSelect = function ($item, $model, $label) {
    $scope.selectedSubjects.push($item);
  }
})
.controller('ScheduleDetailCtrl',function($scope, $http, sharedSchedule){
  $scope.scheduleItems = sharedSchedule.getSchedule();
  $scope.daysOfWeek =
    ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
  $scope.hours = [];
  for (var i = 7; i <= 20; i++) {
    $scope.hours.push(i + ":00");
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
      busyArray.push(( item + 4096 ).toString(2).substring(2));
    });
    var groupsArray = [];
    scheduleItems.groups.forEach(function(group,index){
      var groupHours = [];
      group[1].forEach(function(item){
        groupHours.push(( item + 4096 ).toString(2).substring(2));
      });
      groupsArray.push({
        text: ("grupo" + index),
        hours: groupHours
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
          class: "",
        });
      };
      schedule[i+1] = row;
    };
    return schedule;
  };
  $scope.$watch('sharedSchedule.getSchedule()', function(newValue){
    console.log("big brother is watching you");
    $scope.schedule = $scope.parseSchedule($scope.daysOfWeek, $scope.hours, $scope.scheduleItems);
  });

})
.controller('ScheduleListCtrl',function($scope, $http, sharedSchedule, $q){
  $scope.schedules = {};
  $http.get('/api/v1.0/schedule/random/?format=json').then(function(result){
    $scope.schedules = result.data;
  });
  $scope.loadSchedule = function(index){
    console.log(index);
    sharedSchedule.setSchedule($scope.schedules[index]);
  }
});
