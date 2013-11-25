'use strict';

/**
* Subject controller definition
* @scope Controllers
*/
define(['./module'], function (models) {
  models.factory('Schedule', function ($http, SubjectService) {
    var HEADING_ONE = Math.pow(2,25);

    /*
     * transpose an schedule matrix
     */
    var transpose = function(arr, schedItem) {
      var trans = [];
      _.each(arr, function(row, x){
        _.each(row, function(col, y){
          if (!trans[y]) { trans[y] = [] };
          if (col === '1'){
            trans[y][x] = schedItem;
          } else {
            trans[y][x] = {};
          }
        });
      });
      return trans;
    };
    /*
     * concatenates 2 schedules
     * this does not validate the schedules
     */
    var sumMatrix = function(arr1, arr2) {
      _.each(arr1, function(col, x){
        _.each(col, function(row, y){
          if (!_.isEmpty(arr2[x][y])) {
            arr1[x][y] = arr2[x][y];
          }
        });
      });
      return arr1;
    };

    function ScheduleThumbnail(w,h){
        this.w = w;
        this.h = h;
        this.color = { 
                    "turquoise": "#1abc9c",
                    "emerland": "#2ecc71",
                    "peter-river": "#3498db",
                    "amethyst": "#9b59b6",
                    "wet-asphalt": "#34495e",
                    "green-sea": "#16a085",
                    "nephritis": "#27ae60",
                    "belize-hole": "#2980b9",
                    "wisteria": "#8e44ad",
                    "midnight-blue": "#2c3e50",
                    "sun-flower": "#f1c40f",
                    "carrot": "#e67e22",
                    "alizarin": "#e74c3c",
                    "clouds": "#ecf0f1",
                    "concrete": "#95a5a6",
                    "orange": "#f39c12",
                    "pumpkin": "#d35400",
                    "pomegranate": "#c0392b",
                    "silver": "#bdc3c7",
                    "asbestos": "#7f8c8d"};
    }

    ScheduleThumbnail.prototype.draw = function (context,schedules,x,y,lineWidth){

        function roundedRect(x, y, w, h, r,context){
            context.beginPath();
            context.moveTo(x+r, y);
            context.lineTo(x+w-r, y);
            context.quadraticCurveTo(x+w, y, x+w, y+r);
            context.lineTo(x+w, y+h-r);
            context.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
            context.lineTo(x+r, y+h);
            context.quadraticCurveTo(x, y+h, x, y+h-r);
            context.lineTo(x, y+r);
            context.quadraticCurveTo(x, y, x+r, y);
        }

        context.fillStyle = 'white';
        context.lineWidth = lineWidth;
        context.strokeStyle = 'gray';
        roundedRect(x, y, this.w, this.h,10,context);
        context.fill();
        context.stroke();
        var dayWidth = this.w / 7.0;
        var hourHeight = this.h / 24.0;
        
        context.lineWidth = 0;
        for(var s in schedules){
            
            var lx = x;
            var ly = y;
            context.beginPath();
            context.fillStyle= this.color[schedules[s]["color"]];
            for (var t in schedules[s]["schedule"]){                
                var hours = schedules[s]["schedule"][t];
                ly = y;
                for (var h in hours){
                    if(hours[h] == '1'){
                        context.rect(lx,ly,dayWidth,hourHeight);
                        context.fill();
                    }
                    ly += hourHeight;
                }
                lx += dayWidth;
                context.fill();
            }             
        }
        context.linWidth = lineWidth;
        context.beginPath();
        context.lineWidth = lineWidth/2;
        for(var i=1;i<7;i++){
            context.moveTo(x+(i*dayWidth),y);
            context.lineTo(x+(i*dayWidth),y+this.h);
            context.stroke();
        }
        context.moveTo(x,y+this.h/2);
        context.lineTo(x+this.w,y+this.h/2);
        context.stroke();
    }

    var canvas = document.createElement("canvas");
    canvas.width = 110;
    canvas.height= 55;
    var context = canvas.getContext('2d');
    var generator = new ScheduleThumbnail(100,50);

    var Schedule = function(schedItems){

      var that = this;
      /*
       * adds the heading zeros and transforms the values to binary for the
       * busy array returns a string
       */
      var decimalToSchedString = function(value){

        that.earlyHours = (value & 127) > 0 || false || that.earlyHours;
        that.lateHours  = (value & 15728640) > 0 || false || that.lateHours;
        return ( value + HEADING_ONE ).toString(2).substring(2).split('').reverse().join('');
      };

      var parseRows = function(){
        var scheduleMatrix = transpose(that.busy, { name : 'busy', class : 'busy'});
        _.each(that.groups, function(group){
          var gName = (_.isUndefined(group.subject)) ? 'no hay horario' : group.subject + '-' + group.code;
          var gClass = (_.isUndefined(group.color)) ? 'warning' : group.color;
          var schedT = transpose(group.schedule, {name: gName , color : gClass});
          scheduleMatrix = sumMatrix(scheduleMatrix, schedT);
        });
        that.rows = scheduleMatrix;


        //var groupsT = transpose(that.groups);
      };

      var draw = function(){
        console.log(that.groups);
        generator.draw(context,that.groups,1,1,0.5);
        return canvas.toDataURL();
      }
      
      angular.extend(this,{
        rows: schedule,
        earlyHours: false,
        lateHours: false,
        toString: '',
        subjects: [],
        groups: [],
        busy: [],
        thumbnail : draw,
        parseRows : parseRows
      });
      canvas.width = canvas.width;
      /*
       * lazy loading rows for better performance
       */
      var rows =  new Array(24);
      _.each(rows, function(row){
        row = [];
        var cols = new Array(7);
        row.push(cols);
      });
      var schedule = rows;
      /*
       * TODO: get the appropiate busy code here
       */
      var dummyBusy = [0,0,0,0,0,0,0];

      dummyBusy.forEach(function(item){
        that.busy.push(decimalToSchedString(item));
      });

      schedItems.groups.forEach(function(group){
        var  s = [];
        group.schedule.forEach(function(item){
          s.push(decimalToSchedString(item));
        });
        var g = SubjectService.getByCode(group.subject);
        that.groups.push({
          subject: g.code,
          code: group.code,
          schedule: s ,
          color: g.color,
          dept : g.departament
        });
        that.subjects.push(g);

      });
    };
    return Schedule;
  });
});
