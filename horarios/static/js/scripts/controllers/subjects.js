'use strict';

angular.module('schedulesApp')
.controller('SubjectsCtrl', function($scope, $http, limitToFilter, sharedSchedule, sharedColor) {
  $scope.selectedGroups = {};
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
      item.groups.forEach(function(teacher){
        teacher.groups.forEach(function(group){
          $scope.addGroup({subject: group.subject, code : group.code}, true);
        });
      });
      item.color = sharedColor.getSubjectColor(item.code);
      $scope.selectedSubjects.push(item);
      $scope.selectedSubjects.forEach(function(subject){
        query += subject.code.toString() + ",";
      })
      $http.get('/api/v1.0/schedule/subjects=' + query.substring(0,query.length-1) +'&busy=')
      .then(function(result){
        sharedSchedule.setSchedules(result.data);
      });
      $scope.model = {};
    });
  };
  $scope.formatInput = function(){
    return "";
  }
  $scope.addGroup = function (group, initial) {
    var s = "" + group.subject;
    var c = "" + group.code;
    if(initial){
      if($scope.selectedGroups[s] == undefined){
        $scope.selectedGroups[s] = {};
      }
      $scope.selectedGroups[s][c] = true;
    } else {
      if(group.check === false){
        $scope.selectedGroups[s][c] = true;
      }
      else if(group.check == undefined){
        group.check = false;
        delete($scope.selectedGroups[s][c]);
      }
      else{
        delete($scope.selectedGroups[s][c]);
      }
      var query = "";
      for (var subject in $scope.selectedGroups){
        if($scope.selectedGroups.hasOwnProperty(subject)){
          if(Object.keys($scope.selectedGroups[subject]).length > 0){
            query += subject + "|";
            for (var code in $scope.selectedGroups[subject]){
              if($scope.selectedGroups[subject].hasOwnProperty(code)){
                query += code;
                query += "|";
              }
            }
            query = query.substring(0,query.length-1);
            query += ",";
          }
        }
      }
      console.log(query);
      $http.get('/api/v1.0/schedule/subjects=' + query.substring(0,query.length-1) +'&busy=')
      .then(function(result){
        if (result.data.length == 0) sharedSchedule.resetSchedule();
        else sharedSchedule.setSchedules(result.data);
      });
    }
  }
});
