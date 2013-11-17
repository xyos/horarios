define(['./module'],function (services){
  services.service('ScheduleService', function($http, $q, Schedule){
    var schedules = [];
    return {
      add: function(items){
        items.forEach(function(schedule){
          sched = new Schedule.Schedule(schedule);
          schedules.push(sched);
        });
      },
      getCount: function(){
        return schedules.length;
      },
      reset: function(){
        schedules = [];
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
    }
  });
});
