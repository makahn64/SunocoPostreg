app.controller("setupController",[ "$scope", "$rootScope", "$window", "$location", "userDefaults", "nodeA8", "$log",
    function($scope, $rootScope, $window, $location, userDefaults, nodeA8, $log) {

        $scope.settings = $rootScope.settings;

        $scope.foundServers = [];

        $scope.done = function() {
            userDefaults.setStringForKey("a8SiteOrigin", $scope.settings.a8SiteOrigin);
            $location.path('/');
            //Assuming this forces hard reload which reloads the base IP
            $window.location.reload();
        };

        $scope.ui = {
            myIp: nodeA8.getMyIp()
        }

        nodeA8.huntServers();

        $scope.$on('FOUND_A8', function(event, args){

            $log.debug("A8 found: "+args);
            $scope.foundServers.push(args);

        });

        $scope.use = function(apiPath){

            $scope.settings.a8SiteOrigin = apiPath;
        }

}]);