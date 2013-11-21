define(['./module'],function (services){
  'use strict';
  services.service('ScheduleService', function($http, $q, Schedule){
    var initialItems = {
      'busy': [0, 0, 0, 0, 0, 0, 0],
      'groups': [{
        code : '',
        schedule :  [33554431, 33554431, 33554431, 33554431, 33554431 ,33554431, 33554431],
        subject : '-no hay horario',
        name : ''
      }]
    };

    var initialSchedule = new Schedule(initialItems);
    initialSchedule.parseRows();

    var schedules = [];
    schedules.push(initialSchedule);
    var activeSchedule = schedules[0];
    var reset  = function(){
      schedules = [];
      schedules.push(initialSchedule);
      var activeSchedule = schedules[0];
    };
    return {
      getActive: function(index){
        return activeSchedule;
      },
      setActive: function(index){
        activeSchedule = schedules[index];
      },
      reset: reset,
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
        if(_.isEmpty(schedules)){
          reset();
        }
        return schedules;
      }
    };
  });
});
