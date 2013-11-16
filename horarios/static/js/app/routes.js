define(['../app'],function (app) {
  app.config(
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
          templateUrl : '/static/partials/schedules.html'
        })
        .state('schedules.ui',{
          url : '',
          views: {
            'subjects@schedules': {
              templateUrl: '/static/partials/subjects.html',
            },
            'detail@schedules': {
              templateUrl: '/static/partials/schedules.detail.html',
            },
            'list@schedules': {
              templateUrl: '/static/partials/schedules.list.html',
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
