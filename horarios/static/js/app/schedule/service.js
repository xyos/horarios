define(['./module'],function (services){
  'use strict';
  services.service('ScheduleService', function($http, $q, Schedule){
    var initialItems = {
      'busy': [0, 0, 0, 0, 0, 0, 0],
      'groups': [{
        code : 'no hay horario',
        schedule :  [33554431, 33554431, 33554431, 33554431, 33554431 ,33554431, 33554431],
        subject : 'no hay horario',
        name : ''
      }]
    };
    var initialSchedule = new Schedule(initialItems);
    var schedules = [];
    schedules.push(initialSchedule);
    return {
      reset: function(){
        schedules = [];
        schedules.push(initialSchedule);
      },
      fetch: function(query){
        schedules = [];
        return $http.get('/api/v1.0/schedule/subjects=' + query + '&busy=')
        .then(function(response){
          response.data.forEach(function(sched){
            var schedule = new Schedule(sched);
            schedules.push(schedule);
          });
        });
      },
      get: function(index){
        return schedules[index];
      },
      getList: function(){
        return schedules;
      }
    };
  });
});
