/**
 * Created by mkahn on 12/4/14.
 */

/**
 *
 * Central root controller, right below rootScope.
 *
 */

app.controller("rootController", ["$rootScope", "$location", "$timeout", "$filter", "$interval", "$log", "media", "nodeA8", "a8API",
    "$window",
    function ($rootScope, $location, $timeout, $filter, $interval, $log, media, nodeA8, a8API, $window ) {

        $log.info("rootController be loaded");
        $log.info("My IP address is: "+ nodeA8.getMyIp());
        $log.info( "My subnet address is: " + nodeA8.getMySubnet() );

        //nodeA8.huntServers();

        // TODO: put in inactivity watcher

        var MEDIA_RELOAD_INTERVAL = 15000;  // time in ms between each reload of the media

        $interval(media.load, MEDIA_RELOAD_INTERVAL);

        $rootScope.modal = {path: 'app/shared/appdWidgets/adToast.partial.html', message: "", show: false};
        $rootScope.a8connection = false;

        $rootScope.showPopupModal = function (message, lifespan) {
            if (lifespan === undefined) {
                lifespan = 3000;
            }
            $rootScope.modal.show = true;
            $rootScope.modal.message = message;
            $timeout(function () {
                $rootScope.modal.show = false
            }, lifespan);
        };

        $rootScope.goHome = function (delay) {
            if (delay === undefined)
                $location.path('/');
            else
                $timeout(function() { $location.path('/') }, delay);
        };

        $rootScope.goToPath = function (path) {
            $location.path(path);
        };

        // TODO: create a setup page?
        var setupTaps = 0;

        $rootScope.setup = function () {

            if (setupTaps++ > 10)
                $location.path("/setup");

            $timeout(function () {
                setupTaps = 0;
            }, 5000);

        }

        $rootScope.hardReload = function(){
            $location.path( '/' );
            //Assuming this forces hard reload which reloads the base IP
            $window.location.reload();

        }

        function monitor() {

            a8API.getResource('queue')
                .then( function(res){

                    $log.info("RootScope: A8 connection verified");
                    $rootScope.$broadcast("A8_CONNECTED");
                    $rootScope.a8connection = true;

                })
                .catch( function(err){

                    $rootScope.showPopupModal("Connection to Activ8or Lost!");
                    $log.error( "RootScope: A8 connection not available!" );
                    $rootScope.$broadcast( "A8_CONNECTION_FAIL" );
                    $rootScope.a8connection = false;


                })

            $timeout(monitor, 15000);

        }

        monitor();

    }]);
