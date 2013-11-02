'use strict';

angular.module('schedulesApp')
.controller('SubjectsCtrl', function($scope, $http, limitToFilter, sharedSchedule) {
  $scope.selectedSubjects = [];
  $scope.subjects = function(subjectName){
    return $http.get('/api/v1.0/subject/autocomplete/' + subjectName + '/?format=json')
    .then(function(response){
      return limitToFilter(response.data,15);
    });
  };
  $scope.onSelect = function ($item, $model, $label) {
    $scope.selectedSubjects.push($item);
    var query = "";
    $scope.selectedSubjects.forEach(function(subject){
      query += subject.code.toString() + ",";
    })
    console.log(query);
    $http.get('/api/v1.0/schedule/subjects=' + query.substring(0,query.length-1) +'&busy=')
    .then(function(result){
      sharedSchedule.setSchedules(result.data);
    });
  }
})
.controller('ScheduleDetailCtrl',function($scope, $http, sharedSchedule){
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
      console.log(group);
      var groupHours = [];
      group.schedule.forEach(function(item){
        groupHours.push(( item + Math.pow(2,25) ).toString(2).substring(1));
      });
      groupsArray.push({
        text: (group.subject),
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
  $scope.sharedSchedule = sharedSchedule;
  $scope.$watch('sharedSchedule.getActiveSchedule()', function(newValue){
    console.log("big brother is watching you");
    $scope.schedule = $scope.parseSchedule($scope.daysOfWeek, $scope.hours, newValue);
  });

})
.controller('ScheduleListCtrl',function($scope, $http, sharedSchedule, $q){
  $scope.schedules = {};
  $scope.sharedSchedule = sharedSchedule;
  $scope.$watch('sharedSchedule.getSchedules()', function(newValue){
    $scope.schedules = newValue;
  });
  $scope.loadSchedule = function(index){
    sharedSchedule.setActiveSchedule(index);
  }
});
