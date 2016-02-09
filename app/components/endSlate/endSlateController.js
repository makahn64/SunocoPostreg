/**
 *
 * End Screeh Controller
 *
 */

app.controller("endSlateController",[ "$scope", "$timeout", "$location", function($scope, $timeout, $location) {

    console.log("approveController be loaded.");

    var homeTimeout = undefined;

    $scope.home = function (delay) {
        if (delay === undefined) {
            if (homeTimeout) {
                $timeout.cancel(homeTimeout);
            }
            $location.path('/');
        }
        else
            homeTimeout = $timeout(function() { $location.path('/') }, delay);
    };

}]);