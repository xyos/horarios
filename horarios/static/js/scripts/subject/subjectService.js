'use strict';

angular.module('schedulesApp')
  .service('subjectService', function($http, $q, Subject, limitToFilter){
    // we will store and cache the subjects here
    var subjects = [];
    var s = {
      name: 'hola',
      code: 123456,
      groups: [],
      teachers: [{name:"hola"},{name:"mundo"}],
      departament: 'asddas'
    };
    angular.extend(s, Subject)
    subjects.push(s);
    var colors = [];
    return {
      // we will pick from cache first
      getByCode : function(code){
        var cache = subjects.filter(function(subject){
          return subject.code == code;
        });
        if (cache.length > 0) {
          return cache[0];
        }
        else{
          var s = {
            name : "algebra",
            code : code,
            departament : 'asdasd',
          }
          return new Subject(s);
        }
      },
      autoComplete : function(name){
        return $http.get('/api/v1.0/subject/autocomplete/' + name + '/?format=json')
        .then(function(response){
          return limitToFilter(response.data,15);
        });
      }
    };
});
