define(['./module'],function (services){
  'use strict';
  services.service('ScheduleService', function($http, $q, Schedule){
    var initialSchedule = [{
      'busy': [0, 0, 0, 0, 0, 0, 0],
      'groups': [{
        code : 'no hay horario',
        schedule :  [33554431, 33554431, 33554431, 33554431, 33554431 ,33554431, 33554431],
        subject : 'no hay horario',
        name : ''
      }]
    }];
    var schedules = initialSchedule;
    return {
      add: function(items){
        items.forEach(function(schedule){
          var sched = new Schedule.Schedule(schedule);
          schedules.push(sched);
        });
      },
      getCount: function(){
        return schedules.length;
      },
      reset: function(){
        schedules = initialSchedule;
      },
      fetch: function(){
        schedules = initialSchedule;
      },
      get: function(index){
        return schedules[index];
      },
      getList: function(){
        return schedules;
      },
      getThumbnail : function(index){
        return schedules.thumbnail;
      }
    };
  });
});
