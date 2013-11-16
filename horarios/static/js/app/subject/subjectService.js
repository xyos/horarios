'use strict';

angular.module('schedulesApp')
  .service('subjectService', function($http, $q, Subject, limitToFilter){
    // we will store and cache the subjects here
    var subjects = [];
    var s = {
      name: 'hola',
      code: 123456,
      groups: [],
      teachers: [{teachers:"hola"},{teachers:"mundo"}],
      departament: 'asddas'
    };
    angular.extend(s, Subject)
    subjects.push(s);
    var assignedColors = {};
    var colors = [
    'turquoise', 'emerland', 'peter-river', 'amethyst', 'wet-asphalt',
    'green-sea', 'nephritis', 'belize-hole', 'wisteria', 'midnight-blue',
    'sun-flower', 'carrot', 'alizarin', 'concrete', 'orange',
    'pumpkin', 'pomegranate', 'asbestos' ];
    var getColor = function(code){
      if(assignedColors[code] == undefined){
        var rand = Math.floor(Math.random() * colors.length);
        var randcolor = colors[rand];
        assignedColors[code] = randcolor;
        colors.splice(rand,1);
      }
      return assignedColors[code];
    }
    var freeColor = function(code){
      colors.push(assignedColors[code]);
      delete assignedColors[code];
    }
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
            color: getColor(code)
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
