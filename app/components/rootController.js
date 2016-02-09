/**
 * Created by mkahn on 12/4/14.
 */

/**
 *
 * Central root controller, right below rootScope.
 *
 */

app.controller("rootController", ["$rootScope", "$location", "$timeout", "$filter", "$interval", "$log", "media",
    function ($rootScope, $location, $timeout, $filter, $interval, $log, media) {

        $log.info("rootController be loaded");

        // TODO: put in inactivity watcher

        var MEDIA_RELOAD_INTERVAL = 15000;  // time in ms between each reload of the media

        $interval(media.load, MEDIA_RELOAD_INTERVAL);

        $rootScope.modal = {path: 'app/shared/appdWidgets/adToast.partial.html', message: "", show: false};

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
                window.location.assign("/setup");

            $timeout(function () {
                setupTaps = 0;
            }, 5000);

        }

    }]);
