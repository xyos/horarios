angular.module('schedulesApp')

    // A RESTful factory for retreiving schedules from 'schedules.json'
  .factory('schedules', ['$http', function ($http, utils) {
    var path = 'schedules.json';
    var schedules = $http.get(path).then(function (resp) {
      return resp.data.schedules;
      console.log(resp.data.schedules);
    });


    var factory = {};
    factory.all = function () {
      return schedules;

    };

    factory.get = function (id) {
      return schedules.then(function(){
        return utils.findById(schedules, id);
      })
    };
    return factory;
  }])


  .factory('utils', function () {

    return {

      // Util for finding an object by its 'id' property among an array
      findById: function findById(a, id) {
        for (var i = 0; i < a.length; i++) {
          if (a[i].id == id) return a[i];
        }
        return null;
      }

    };

  });
