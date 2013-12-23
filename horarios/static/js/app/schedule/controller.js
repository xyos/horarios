/**
 * Schedule controller definition
 * @scope Controllers
 */
define(['./module'], function (controllers) {
  'use strict';
  controllers.controller('ScheduleDetailCtrl', function ($scope, $rootScope, ScheduleService, SubjectService) {
    $scope.daysOfWeek =
      ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    $scope.hours = [];
    $scope.scheduleNumber = ScheduleService.getActive().index;
    $scope.busy = [];
    $scope.busySelect = false;
    $scope.$watch('busySelect', function (value) {
      if (!value) {
        ScheduleService.setBusy($scope.busy);
        $scope.$emit('scheduleChange', SubjectService.getQuery());
      }
    });
    for (var i = 1; i <= 24; i++) {
      $scope.hours.push(i - 1 + ':00 - ' + i + ':00');
      $scope.busy.push([false, false, false, false, false, false, false]);
    }

    $scope.schedule = ScheduleService.getActive();
    $scope.$watch('ScheduleService.getActive()', function (newVal, oldVal) {
      $scope.schedules = newVal;
    });
    /*
     * Shows if a row should be shown or not depends on the early, late hours
     */
    $scope.showRow = function (index) {
      if (index >= 0 && index < 7) {
        return ScheduleService.getActive().earlyHours;
      }
      else if (index >= 20 && index < 24) {
        return ScheduleService.getActive().lateHours;
      } else {
        return true;
      }
    };
    /*
     * refresh the view after a subject is changed
     */
    $rootScope.$on('activeScheduleChange', function (event) {
      ScheduleService.getActive().parseRows();
      $scope.schedule = ScheduleService.getActive();
    });
    /*
     * toggles the row status
     */
    $scope.toggleRow = function (row, col) {
      if ($scope.busySelect) {
        $scope.busy[row][col] = !$scope.busy[row][col];
        $scope.$emit('activeScheduleChange');
      }
    };

  });
  controllers.controller('ScheduleListCtrl', function ($scope, $rootScope, ScheduleService) {
    /*
     * retrieves the schedules from the service
     */
    $scope.schedules = ScheduleService.getList();
    $scope.index = 0;
    $scope.height = 50;
    $scope.width = 100;
    $scope.padding = 1;
    $scope.lineWidth = 1;
    $scope.currentPage = 0;
    $scope.pageSize = 6;
    $scope.numberOfPages = function () {
      if (_.isUndefined($scope.schedules)) {
        return 1;
      }
      return Math.ceil($scope.schedules.length / $scope.pageSize);
    };
    $scope.range = function (n) {
      var r = [0];
      for (var i = 1; i < n; i++) {
        r.push(i);
      }
      return r;
    };
    $scope.$watch('ScheduleService.getList()', function (newVal) {
      $scope.schedules = newVal;
    });
    $scope.loadSchedule = function (index) {
      ScheduleService.setActive(index);
      $scope.index = index;
      $scope.$emit('activeScheduleChange');
    };
    /*
     * refresh the view after a subject is changed
     */
    var lastQuery = '';
    $rootScope.$on('scheduleChange', function (event, query) {
      console.log(ScheduleService.getQuery());
      if (ScheduleService.getQuery() !== lastQuery) {
        ScheduleService.fetch(query).then(function () {
          $scope.schedules = ScheduleService.getList();
          ScheduleService.setActive(0);
          $scope.index = 0;
          $scope.currentPage = 0;
          $scope.$emit('activeScheduleChange');
          lastQuery = ScheduleService.getQuery();
        });
      }

    });

    $scope.update = function () {
      $scope.$apply();
    };
  });
});
