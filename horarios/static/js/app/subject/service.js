define(['./module'],function (services){
  'use strict';
  services.service('SubjectService', function($http, $q, Subject, limitToFilter){
    // we will store and cache the subjects here
    var subjects = [];
    // store the colors for reuse on delete
    var assignedColors = {};
    var colors = [
      'turquoise', 'emerland', 'peter-river', 'amethyst', 'wet-asphalt',
      'green-sea', 'nephritis', 'belize-hole', 'wisteria', 'midnight-blue',
      'sun-flower', 'carrot', 'alizarin', 'concrete', 'orange',
      'pumpkin', 'pomegranate', 'asbestos'
    ];
    var getColor = function(code){
      if(assignedColors[code] === undefined){
        var rand = Math.floor(Math.random() * colors.length);
        var randcolor = colors[rand];
        assignedColors[code] = randcolor;
        colors.splice(rand,1);
      }
      return assignedColors[code];
    };
    var freeColor = function(code){
      colors.push(assignedColors[code]);
      delete assignedColors[code];
    };
    var getSubject = function(code){
      var search = subjects.filter(function(subject){
        return parseInt(subject.code) === parseInt(code);
      });
      if (search.length > 0) {
        return search[0];
      } else {
        return false;
      }
    };
    /*
     * exposing the service methods
     */
    return {
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
      add : function(item){
        /*
         * Searching in the subjects array
         */
        var isSubject = getSubject(item.code);
        if(!isSubject){
          var s = {
            name : item.name,
            code : item.code,
            departament : 'BIO',
            color: getColor(item.code)
          };
          var subject = new Subject(s);
          subjects.push(subject);
        }
      },
      getByCode: function(code){
        return getSubject(parseInt(code));
      },
      getTooltip: function(subjectCode,groupCode){
          console.log(subjectCode);
          console.log(groupCode);

        var subject = getSubject(subjectCode);
        console.log(subject);
        var teacherName = "";
        _.forEach(subject.teachers,function(teacher){
          _.forEach(teacher.groups,function(group){
            if(group.code === groupCode){
              teacherName = teacher.name;
            }
          });
        });
        return teacherName;
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
            return "";
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
        if(query.length > 0) query = query.substring(1);
        return query;
      }
    };
  });
});
