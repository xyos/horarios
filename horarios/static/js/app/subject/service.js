define(['./module'],function (services){
  'use strict';
  services.service('SubjectService', function($http, $q, Subject, limitToFilter){
    // stores the subjects here
    var subjects = [];
    // store the colors for reuse on delete
    var assignedColors = {};
    var colors = [
      'turquoise', 'emerland', 'peter-river', 'amethyst', 'wet-asphalt',
      'green-sea', 'nephritis', 'belize-hole', 'wisteria', 'midnight-blue',
      'sun-flower', 'carrot', 'alizarin', 'concrete', 'orange',
      'pumpkin', 'pomegranate', 'asbestos'
    ];
    // picks a random color from unused colors
    var getColor = function(code){
      if(assignedColors[code] === undefined){
        var rand = Math.floor(Math.random() * colors.length);
        var randcolor = colors[rand];
        assignedColors[code] = randcolor;
        colors.splice(rand,1);
      }
      return assignedColors[code];
    };
    // returns a color to the avalaible colors
    var freeColor = function(code){
      colors.push(assignedColors[code]);
      delete assignedColors[code];
    };
    // returns a subject from subjects array by code
    var getSubject = function(code){
      var search = subjects.filter(function(subject){
        return parseInt(subject.code,10) === parseInt(code,10);
      });
      if (search.length > 0) {
        return search[0];
      } else {
        return false;
      }
    };
    //
    var add = function (item) {
      if (angular.isUndefined(item.name)) {
        item.name = 'Sin Profesor Asignado';
      }
      var s = {
        name: item.name,
        code: item.code,
        departament: 'BIO',
        color: getColor(item.code),
        groups: item.groups
      };
      return Subject.getSubject(s).then(function (subject) {
        return addSubject(subject);
      });
    };
    var addSubject = function (subject) {
      var deferred = $q.defer();
      if(getSubject(subject.code)){
        deferred.resolve(false);
      }else{
        subjects.push(subject);
        deferred.resolve(true);
      }
      return deferred.promise;
    };
    /*
     * exposing the service methods
     */
    return {
      add : add,
      addSubjects: function (subjects) {
        var deferred = $q.defer();
        var promises = [];
        subjects.forEach(function (subject) {
          var s = subject.split('|');
          var code = s.splice(0, 1);
          var groups = s;
          if (!getSubject(parseInt(code,10))) {
            promises.push(add({code: code, groups: groups}));
          }
        });
        $q.all(promises).then(function () {
          deferred.resolve('true');
        });
        return deferred.promise;
      },
      get : function(){
        return subjects;
      },
      del : function(code){
        for (var i =0; i < subjects.length; i++) {
          if (subjects[i].code === code) {
            subjects.splice(i,1);
            freeColor(code);
            break;
          }
        }
      },
      getByCode: function(code){
        return getSubject(parseInt(code,10));
      },
      getTooltip: function(subjectCode,groupCode){

        var subject = getSubject(subjectCode);
        var teacherName = '';
        _.forEach(subject.teachers,function(teacher){
          _.forEach(teacher.groups,function(group){
            if(group.code === groupCode){
              teacherName = teacher.name;
            }
          });
        });
        return teacherName;
      },
      getSubjectSimplifiedName: function(subjectCode){

        return getSubject(subjectCode).name
          .toLowerCase()
          .replace(/(?!\b\w)([a-z]*)((\b )|\.|$)/g, '')
          .toUpperCase().substring(0,8);
      },
      autoComplete : function(name){
        return $http.get('/api/v1.0/subject/autocomplete/' + name + '/?format=json')
        .then(function(response){
          return limitToFilter(response.data,15);
        });
      },
      getQuery: function(){
        var query = '';
        subjects.forEach(function(subject){
          var appendOnce = false;
          if ( subject.teachers === null ){
            return '';
          } else {
            subject.teachers.forEach(function(teacher){
              teacher.groups.forEach(function(group){
                if (group.isChecked) {
                  if(!appendOnce) {
                    query += ',' + group.subject;
                    appendOnce = true;
                  }
                  query += '|' + group.code;
                }
              });
            });
          }
        });
        if(query.length > 0) {query = query.substring(1);}
        return query;
      }
    };
  });
});
