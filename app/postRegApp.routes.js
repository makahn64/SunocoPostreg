//Define an angular module for our app


app.config([ "$routeProvider", function($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'app/components/tapToStart/tapToStart.partial.html'
        })

        .when('/enterCode', {
            templateUrl: 'app/components/enterCode/enterCode.partial.html',
            controller: 'enterCodeController'
        })

        .when('/picker', {
            templateUrl: 'app/components/picker/picker.partial.html',
            controller: 'pickerController'
        })

        .when('/register', {
            templateUrl: 'app/components/register/register.partial.html',
            controller: 'regController'
        })

        .when('/approve', {
            templateUrl: 'app/components/approve/approve.partial.html',
            controller: 'approveController'
        })

         .when('/endslate', {
            templateUrl: 'app/components/endSlate/endSlate.partial.html',
            controller: 'endSlateController'
        })

        .otherwise({
            redirectTo: '/'
        });

}]);





