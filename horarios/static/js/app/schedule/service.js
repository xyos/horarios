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
        schedules = [];
        schedules.push(initialSchedule);
      },
      fetch: function(query){
        console.log(query);
        //var throttled = _.throttle(, 5000);
        schedules = [];
        schedules.push(initialSchedule);
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
