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
  console.log(sharedSchedule.getSchedule());
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
    console.log(busyArray);
    for (var i = 0; i < hours.length; i++) {
      var row = [];
      row.push({text : hours[i], class : 'heading'});
      for (var j = 0; j < daysOfWeek.length; j++) {
        //adding busy hours
        row.push({text: ( (busyArray[j][i] == "1") ? "ocupado" : "" ),
                 class: "",
                 busy : ( (busyArray[j][i] == "1") ? 1 : 0 )
        });
      };
      schedule[i+1] = row;
    };
    return schedule;
  }
  $scope.schedule =
    $scope.parseSchedule($scope.daysOfWeek, $scope.hours, $scope.scheduleItems);
  console.log($scope.schedule);
})
.controller('ScheduleListCtrl',function($scope, $http, sharedSchedule){
  $scope.getSchedules = function(){
    return $http.get('/api/v1.0/schedule/random/?format=json')
    .then(function(response){
      return response.data;
    });
  };
 $scope.schedules = $scope.getSchedules();
 //sharedSchedule.setSchedule($scope.schedules[0]);
});
