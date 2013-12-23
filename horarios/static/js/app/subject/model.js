'use strict';

/**
* Subject model definition
*/
define(['./module'], function (models) {
  'use strict';
  /**
   * Creates a new Subject based on subject code
   */
  models.factory('Subject', function ($http) {
    /**
     * Returns a promise of the teachers and groups from a given subject code
     */
    var getTeachers = function(code){
      return $http.get('/api/v1.0/subject/' + code +'/groups/')
      .success(function(result){
        return result;
      })
      .error(function(data){
        console.log('could not resolve teachers for ' + code);
      });
    }
    /**
     * The Subject Object
     * ------------------
     */
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
        var myTeachers = [];
        data.forEach(function(item,index){
          item.isChecked = true;
          var teacher = item.teacher.trim();
          if (teacher.length < 1) teacher = "Sin profesor asignado";
          var found = false;
          for (var i =0; i < myTeachers.length; i++) {
            if (myTeachers[i].name === item.teacher) {
              var found = true;
              myTeachers[i].groups.push(item);
              break;
            }
          }
          if (!found) {
            var myTeacher = {};
            myTeacher.groups = [];
            myTeacher.name = teacher;
            myTeacher.isChecked = true;
            myTeacher.groups.push(item);
            myTeachers.push(myTeacher);
          }
        });
        that.teachers = myTeachers;
      });
    }
    return Subject;
  });
});
