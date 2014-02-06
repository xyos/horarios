'use strict';

/**
 * Subject model definition
 */
define(['./module'], function (models) {
  /**
   * Creates a new Subject based on subject code
   */
  models.factory('Subject', function ($http, $rootScope, $q) {
    /**
     * Returns a promise of the teachers and groups from a given subject code
     */
    var getTeachers = function (code) {
      return $http.get('/api/v1.0/subject/' + code + '/groups/').error(function () {
          console.log('could not resolve teachers for ' + code);
      });
    };
    var getSubjectInfo = function(code){
      return $http.get('/api/v1.0/subject/' + code ).error(function () {
          console.log('could not resolve info for ' + code);
      });
    };
    var getSubject = function (data) {
      var deferred = $q.defer();

      getSubjectInfo(data.code).success(function(response){
        var s = response;

        var subject = {
          code: s.code,
          name: s.name,
          teachers: {},
          type: s.type,
          departament: '',
          color: data.color,
          credits: s.credits
        };

        getTeachers(data.code).then(function (response) {
          var teachers = response.data;
          var myTeachers = [];
          teachers.forEach(function (item) {
            if(!angular.isUndefined(data.groups)){
              item.isChecked = !!(data.groups.indexOf("" + item.code ) + 1);
            } else {
              item.isChecked = true;
            }
            var teacher = item.teacher.trim();
            if (teacher.length < 1) {
              teacher = 'Sin profesor asignado';
            }
            var found = false;
            for (var i = 0; i < myTeachers.length; i++) {
              if (myTeachers[i].name === item.teacher) {
                found = true;
                myTeachers[i].groups.push(item);
                myTeachers[i].isChecked &= item.isChecked; 
                break;
              }
            }
            if (!found) {
              var myTeacher = {};
              myTeacher.groups = [];
              myTeacher.name = teacher;
              myTeacher.isChecked = item.isChecked;
              myTeacher.groups.push(item);
              myTeachers.push(myTeacher);
            }
          });
          console.log(myTeachers);
          return myTeachers;
        }).then(function (data) {
          subject.teachers = data;
          deferred.resolve(subject);
          $rootScope.$broadcast('scheduleChange');
        }
               );
      });
      return deferred.promise;
    };
    return {
      getSubject: getSubject
    };
  });
});
