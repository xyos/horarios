'use strict';

angular.module('schedulesApp')
  .factory('Subject', function($http,$rootScope){
    var resolved = false;
    var getTeachers = function(code){
      return $http.get('/api/v1.0/subject/' + code +'/groups/')
      .success(function(result){
        var myTeachers = [];
        result.forEach(function(item,index){
          var teacher = item.teacher.trim();
          if (teacher.length < 1) teacher = "Sin profesor asignado";
          if(!(teacher in myTeachers)){
            myTeachers[teacher] = {};
            myTeachers[teacher]["groups"]=[];
            myTeachers[teacher]["name"]=teacher;
          }
          myTeachers[teacher]["groups"].push(item);
        });
        resolved = true;
        return myTeachers;
      })
      .error(function(data){
        console.log('could not resolve teachers for ' + code);
      });
    }
    var Subject = function(data) {
        angular.extend(this,{
          code: null,
          name: '',
          teachers: null,
          departament:'',
          credits:0
        });
        angular.extend(this,data);
        var that = this;
        getTeachers(this.code).success(function(data){
          that.teachers = data;
        });
    }
    return Subject;
});
