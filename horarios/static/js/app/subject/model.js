'use strict';

/**
 * Subject model definition
 */
define(['./module'], function (models) {
  /**
   * Creates a new Subject based on subject code
   */
  models.factory('Subject', function ($http, $rootScope, $q) {
    var deferred = $q.defer();
    /**
     * Returns a promise of the teachers and groups from a given subject code
     */
    var getTeachers = function (code) {
      return $http.get('/api/v1.0/subject/' + code + '/groups/')
        .error(function () {
          console.log('could not resolve teachers for ' + code);
        });
    };
    var getSubject = function (data, scope) {
      var subject = {
        code: data.code,
        name: data.name,
        teachers: null,
        departament: '',
        color: data.color,
        credits: 0
      };
      getTeachers(data.code).success(function (data) {
        var myTeachers = [];
        data.forEach(function (item) {
          item.isChecked = true;
          var teacher = item.teacher.trim();
          if (teacher.length < 1) {
            teacher = 'Sin profesor asignado';
          }
          var found = false;
          for (var i = 0; i < myTeachers.length; i++) {
            if (myTeachers[i].name === item.teacher) {
              found = true;
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
        subject.teachers = myTeachers;
        deferred.resolve(subject);
        $rootScope.$broadcast('scheduleChange');

      });
      return deferred.promise;

    };
    return {
      getSubject: getSubject
    };
  });
});
