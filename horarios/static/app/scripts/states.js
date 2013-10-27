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
          templateUrl : '/partials/schedules.html',
          resolve : {
            schedules : [ 'schedules',
              function(schedules) {
                return schedules.all();
              }
            ]
          },
          controller : ['$scope','$state','schedules',
            function($scope,$state,schedules){
              $scope.schedules = schedules;
            }
          ]

        })
        .state('schedules.list',{
          url : '',
          templateUrl: '/partials/schedules.list.html'
        })
        .state('schedules.detail',{
          url: '/{scheduleId:[0-9]{1,10}}',
          views: {
            '': {
              templateUrl: 'schedules.detail.html',
              controller: ['$scope','$stateParams','utils',
                function($scope,$stateParams,utils) {
                  $scope.schedule = utils.findById($scope.schedules,$stateParams.scheduleId);
                }
              ]
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
