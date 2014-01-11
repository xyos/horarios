define(['./module'], function (directives) {
  'use strict';
  directives.directive('aDisabled', function ($compile) {
    return {
      restrict: 'A',
      priority: -99999,
      link: function (scope, element, attrs) {
        var oldNgClick = attrs.ngClick;
        if (oldNgClick) {
          scope.$watch(attrs.aDisabled, function (val, oldval) {
            if (!!val) {
              element.unbind('click');
            } else if (oldval) {
              attrs.$set('ngClick', oldNgClick);
              element.bind('click', function () {
                scope.$apply(attrs.ngClick);
              });
            }
          });
        }
      }
    };
  });
  directives.directive('lPager', function ($compile) {
    return {
      restrict: 'E',
      templateUrl: '/static/partials/pager.html',
      replace: true,
      scope: {
        pageSize: '=',
        currentPage: '=',
        items: '=',
        onItemSelection: '&'
      },
      link: function ($scope, element, attrs) {
        $scope.range = function (n) {
          var r = [0];
          for (var i = 1; i < n; i++) {
            r.push(i);
          }
          return r;
        };
        $scope.numberOfPages = function () {
          if (angular.isUndefined($scope.items)) {
            return 1;
          }
          return Math.ceil($scope.items.length / $scope.pageSize);
        };
        $scope.$watch('items', function (value) {
          $scope.items = value;
        });
        $scope.$watch('currentPage',function(value){
          $scope.currentPage = value;
        });
      }
    };
  });
});