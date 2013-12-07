define(['./module'],function (services){
  'use strict';
  services.service('ScheduleService', function($http, $q, Schedule){
    var initialItems = {
      'busy': [0, 0, 0, 0, 0, 0, 0],
      'groups': [{
        code : '',
        schedule :  [1048448, 1048448, 1048448, 1048448, 1048448 ,1048448, 1048448],
        subject : '-no hay horario',
        name : '',
        lateHours: false,
        earlyHours: false
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
      activeSchedule = schedules[0];
    };
    return {
      getActive: function(){
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
          if(_.isEmpty(response.data)){
              schedules.push(initialSchedule);
          }
          response.data.forEach(function(sched,index){

            var schedule = new Schedule(sched);
            schedule.index = index;
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
