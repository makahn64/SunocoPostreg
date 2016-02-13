/**
 * Created by mkahn on 12/4/14.
 */

/**
 *
 * Picker Screen Controller
 *
 */

app.controller("pickerController", ["$scope", "ngToast", "$q", "$timeout", "$log", "$location", "$rootScope",
    "a8API", "media", function ($scope, ngToast, $q, $timeout, $log, $location, $rootScope, a8API, media) {

        $log.info("pickerController be loaded.");

        $scope.layout = {
            numPicsInPage: $rootScope.settings.picsPerPage,
            aspect: $rootScope.settings.aspect
        };

        //TODO: include thumbnail capability?
        var USE_THUMBS = false;

        $scope.slide = {fwdIn: false, bkIn: false, fwdOut: false, bkOut: false, thinking: true};
        $scope.pics = [];
        $scope.pages = [];
        $scope.activePage = 0;
        $scope.selected = [false, false, false, false, false, false, false, false, false, false, false, false];

        $scope.ui = { loading: true };

        var preloaded = [];


        function slideOutToLeft() {
            $scope.slide.bkOut = true;
            $scope.slide.bkIn = false;
            $scope.slide.fwdIn = false;
            $scope.slide.fwdOut = false;

            $timeout(function () {
                $scope.slide.thinking = true;
            }, 750);
        }

        function slideOutToRight() {
            $scope.slide.bkOut = false;
            $scope.slide.bkIn = false;
            $scope.slide.fwdIn = false;
            $scope.slide.fwdOut = true;

            $timeout(function () {
                $scope.slide.thinking = true;
            }, 750);
        }


        $scope.buildPage = function () {

            $scope.ui.loading = true;

            var recentMedia = media.getAll();

            if ( recentMedia.length > 0 ) {

                preload( media.getAll().slice( 0, $scope.layout.numPicsInPage ) ).then(
                    function ( arr ) {
                        $scope.pics = arr;
                        $scope.slide.thinking = false;
                        $scope.slide.fwdIn = true;
                        $scope.ui.loading = false;

                    },
                    function () {
                        $log.error( "Error preloading media." );
                    }
                );

                var pages = Math.ceil( media.getAll().length / $scope.layout.numPicsInPage );
                for ( var i = 0; i < pages; i++ ) {
                    $scope.pages.push( i );
                }
            } else {
                $rootScope.showPopupModal( "Hmmm...looks like there are no pics yet!" );
                $timeout( $rootScope.hardReload, 5000 );
            }


        };


        function preload(arrayOfPics) {

            /*if (USE_THUMBS){
             arrayOfPics.forEach(function(p){
             p.url = p.url.replace('photos','styles/thumbnail');

             })
             }*/

            var promises = [];

            for (var i = 0; i < arrayOfPics.length; i++) {
                promises.push(preloadOne(a8API.getSiteOrigin() + '/media/download/' + arrayOfPics[i].id));
            }

            return $q.all(promises).then(
                function() {
                    return arrayOfPics;
                }
            );
        }

        function preloadOne(src) {
            var deferred = $q.defer();
            var img = new Image();

            img.src = src;

            img.onload = function() {
                deferred.resolve();
            };
            img.onerror = function() {
                deferred.reject();
            };

            return deferred.promise;
        }


        function turnPage(fwd) {

            $timeout(function () {
                $scope.ui.loading = true;
                preload(media.getAll().slice($scope.activePage * $scope.layout.numPicsInPage,
                    $scope.activePage * $scope.layout.numPicsInPage + $scope.layout.numPicsInPage)).then(
                    function (arr) {
                        $scope.pics = arr;
                        $scope.slide.bkOut = false;
                        $scope.slide.fwdOut = false;
                        $scope.slide.thinking = false;

                        $scope.ui.loading = false;

                        if (fwd) {
                            $scope.slide.bkIn = false;
                            $scope.slide.fwdIn = true;
                        } else {
                            $scope.slide.bkIn = true;
                            $scope.slide.fwdIn = false;
                        }
                    }
                )
            }, 1000);
        }

        // Called if listening for server refreshes
        function refreshPage() {

            var recentMedia = media.getAll();

            if (recentMedia.length>0){
                $scope.pics = media.getAll().slice( $scope.activePage * $scope.layout.numPicsInPage,
                    $scope.activePage * $scope.layout.numPicsInPage + $scope.layout.numPicsInPage );
            } else {
                $rootScope.showPopupModal("Hmmm...looks like there are no pics yet!");
                $timeout($rootScope.hardReload, 5000);
            }

        }

        function showRefreshError(){
            $rootScope.showPopupModal("There's a problem getting images. Could be a bad network connection.");
            $timeout($rootScope.hardReload, 5000);

        }


        $scope.dotClicked = function (i) {
            console.log("Clicked " + i);
            $scope.activePage = i;
            // TODO do the right anim here...
            turnPage();
        };


        $scope.swipeLeft = function () {
            $scope.activePage++;
            if ($scope.activePage == $scope.pages.length) {
                $scope.activePage = $scope.activePage - 1;
            } else {
                slideOutToRight();
            }

            turnPage(true);
        };


        $scope.swipeRight = function () {
            $scope.activePage--;
            if ($scope.activePage < 0) {
                $scope.activePage = 0;
            } else {
                slideOutToLeft();
            }

            turnPage(false);
        };


        $scope.picClicked = function (p) {
            console.log("Picked " + p);

            if (USE_THUMBS)
                p.url = p.url.replace("styles/thumbnail", "photos");

            media.setPicked(p);
            $location.path('/approve');
        };


        $scope.buildPage();

        $scope.$on('refreshPics', refreshPage);
        $scope.$on('refreshPicsError', showRefreshError);


    }]);
