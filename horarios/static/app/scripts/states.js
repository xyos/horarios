angular.module('schedulesApp').config(
  ['$stateProvider','$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
      $urlRouterProvider
        .otherwise('/');
      $stateProvider
        .state('home' , {
          url : '/',
          template: '<h1>Hello World</h1>'
        })
        .state('schedules',{
          abstract : true,
          url : '/schedules',
          templateUrl : '/partials/schedules.html'
        })
        .state('schedules.ui',{
          url : '',
          views: {
            'subjects@schedules': {
              templateUrl: '/partials/subjects.html',
              controller: ['$scope','$stateParams','utils',
                function($scope,$stateParams,utils) {
                  $scope.schedule = utils.findById($scope.schedules,$stateParams.scheduleId);
                }]},
            'detail@schedules': {
              templateUrl: '/partials/schedules.detail.html',
            },
            'list@schedules': {
              templateUrl: '/partials/schedules.list.html',
            }
          }
        })
        .state('about',{
          url : '/about',
          templateUrl: '/partials/about.html'
        })
        ;
    }]
);
