# Set up the Angular App
angular.module 'MINIAPP', [
    'ngRoute',
    'ngAnimate'
]
.config([
    '$routeProvider',
    ($routeProvider) ->
        $routeProvider
            .when('/test', {
                controller: 'TestsController',
                templateUrl: 'templates/Tests.tpl.html'
            })
            .when('/questions/:questionNumber', {
                controller: 'QuestionsController',
                templateUrl: 'templates/Questions.tpl.html'
            })
            .when('/submit', {
                controller: 'SubmitController',
                templateUrl: 'templates/Submit.tpl.html'
            })
            .when('/results', {
                controller: 'ResultsController',
                templateUrl: 'templates/Results.tpl.html'
            })
            .otherwise({
                redirectTo: '/test'
            })
])
.run([
    '$rootScope',
    '$window',
    (
        $rootScope,
        $window
    ) ->
        $rootScope.back = () ->
            $window.history.back()
]);
