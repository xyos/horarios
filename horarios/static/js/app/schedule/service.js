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
    var busyRows = [];

    var busyQuery = function(){
      var query = '';
      var days = [];
      _.forEach(busyRows, function(hour){
        _.forEach(hour, function(day, index){
          if(_.isUndefined(days[index])){
            days[index] = day ? '1':'0';
          } else {
            days[index] += day ? '1':'0';
          }
        });
      });
      _.forEach(days,function(day){
        query += parseInt(day.split('').reverse().join(''), 2) + ',';
      });
      return query.substring(0, query.length - 1);
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
        return $http.get('/api/v1.0/schedule/subjects=' + query + '&busy=' + busyQuery())
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
      setBusy: function(busy) {
        busyRows = busy;
      },
      getBusy: function(busy) {
        return busyRows;
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
