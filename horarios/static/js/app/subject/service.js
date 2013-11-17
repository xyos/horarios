define(['./module'],function (services){
  services.service('SubjectService', function($http, $q, Subject, limitToFilter){
    // we will store and cache the subjects here
    var subjects = [];
    var s = {
      name: 'hola',
      code: 123456,
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
      'pumpkin', 'pomegranate', 'asbestos' 
    ];
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
    var getSubject = function(code){
      var search = subjects.filter(function(subject){
        return subject.code == code;
      });
      if (search.length > 0) {
        return search[0];
      } else return false;
    }
    /*
     * exposing the service methods
     */
    return {
      get : function(){
        console.log(subjects);
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
        var subject = getSubject(item.code);
        if(!subject){
          var s = {
            name : item.name,
            code : item.code,
            departament : 'BIO',
            color: getColor(item.code)
          }
          var subject = new Subject(s);
          subjects.push(subject);
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
});
