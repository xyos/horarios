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
    var query = "";
    $http.get('/api/v1.0/subject/' + $item.code +'/groups/')
    .then(function(result){
      var teachers = [];
      result.data.forEach(function(item,index){
        var teacher = item.teacher.trim();
        if (teacher.length < 1) teacher = "Sin profesor asignado";
        if(!(teacher in teachers)){
          teachers[teacher] = {};
          teachers[teacher]["groups"]=[];
          teachers[teacher]["name"]=teacher;
        }
        teachers[teacher]["groups"].push(item);
      });
      var groups = [];
      for(var k in teachers){
        groups.push(teachers[k]);
      }
      $item.groups = groups;


      return $item;
    })
    .then(function(item){
      $scope.selectedSubjects.push(item);
      $scope.selectedSubjects.forEach(function(subject){
        query += subject.code.toString() + ",";
      })
      $http.get('/api/v1.0/schedule/subjects=' + query.substring(0,query.length-1) +'&busy=')
      .then(function(result){
        sharedSchedule.setSchedules(result.data);
      });
    });
  };
  $scope.selectedGroups = {};
  $scope.addGroup = function (group) {
    var s = "" + group.subject;
    var c = "" + group.code;
    if(group.check == undefined) group.check = false;
    if(!group.check){
      if($scope.selectedGroups[s] == undefined){
        $scope.selectedGroups[s] = {};
      }
      $scope.selectedGroups[s][c] = true;
    }else{
      delete($scope.selectedGroups[s][c]);
    }
    console.log($scope.selectedGroups);
  }
});
