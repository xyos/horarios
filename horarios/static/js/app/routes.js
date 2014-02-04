define(['../app'],function (app) {
  'use strict';
  app.config(
    ['$stateProvider','$urlRouterProvider',
      function($stateProvider, $urlRouterProvider){
        $urlRouterProvider
        .otherwise('/schedules');
        $stateProvider
        .state('home' , {
          url : '/',
          template: '<h1>Hello World</h1>'
        })
        .state('schedules',{
          abstract : true,
          url : '/schedules?subjects&busy',
          templateUrl : '/static/partials/schedules.html'
        })
        .state('schedules.ui',{
          url : '',
          views: {
            'subjects@schedules': {
              templateUrl: '/static/partials/subjects.html'
            },
            'detail@schedules': {
              templateUrl: '/static/partials/schedules.detail.html'
            },
            'list@schedules': {
              templateUrl: '/static/partials/schedules.list.html'
            }
          }
        })
        .state('about',{
          url : '/about',
          templateUrl: '/static/partials/about.html'
        }) ;
      }]
  );
});
