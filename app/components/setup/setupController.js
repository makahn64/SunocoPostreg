app.controller("setupController",[ "$scope", "$rootScope", "$window", "$location", "userDefaults",
    function($scope, $rootScope, $window, $location, userDefaults) {
        $scope.settings = $rootScope.settings;

        $scope.apply = function() {
            userDefaults.setStringForKey("a8SiteOrigin", $scope.settings.a8SiteOrigin);
            $location.path('/');
            $window.location.reload();
        };
}]);