app.controller( "regController", [ "$rootScope", "$scope", "$log", "ngToast", "$q", "a8API", "$timeout", "$location",
    "media", "regService", function ( $rootScope, $scope, $log, ngToast, $q, a8API, $timeout, $location, media, regService ) {

        $log.info( "regController be loaded." );

        $scope.ui = {
            ready:          false,
            msg:            "",
            emailError:     false,
            firstNameError: false,
            lastNameError:  false
        };

        $scope.user = regService.getUser();

        if ( !$scope.user ) {
            $scope.ui.msg = "Enter your information:";
            $scope.ui.ready = true;
        }
        else {
            $scope.ui.msg = "Confirm your information:";
            $scope.ui.ready = true;
        }

        function createGuest() {

            var guestObj = {
                firstName:   $scope.user.firstName,
                lastName:    $scope.user.lastName,
                email:       $scope.user.email,
            }

            if ($scope.user.badgeId)
                guestObj.address = { badgeId: $scope.user.badgeId };

            //Gets or Creates
            return a8API.registerGuest( guestObj );

        }


        function createExperience( guestObj ) {

            return a8API.addExperience( {
                media:  [ media.getPicked().id ],
                guests: [ guestObj.id ],
                experienceName: "Sunoco Celebration Cam",
                completed: true
            } );

        }

        function validate() {
            $scope.ui.emailError = !$scope.regForm.userEmail.$valid;
            $scope.ui.firstNameError = !$scope.regForm.userFirstName.$valid;
            $scope.ui.lastNameError = !$scope.regForm.userLastName.$valid;

            return $scope.regForm.$valid;
        }

        $scope.$watch( "user.firstName", function ( val ) {
            if ( val )
                $scope.ui.firstNameError = false;
        } );

        $scope.$watch( "user.lastName", function ( val ) {
            if ( val )
                $scope.ui.lastNameError = false;
        } );

        $scope.$watch( "user.email", function ( val ) {
            if ( val )
                $scope.ui.emailError = false;
        } );

        $scope.submit = function () {
            if ( validate() ) {

                $log.info( "Submitting user data for " + $scope.user.firstName );

                createGuest()
                    .then( createExperience )
                    .then( function(res){
                        $log.info("Experience created!");
                        var expId = res.data.id;
                        var mediaId = res.data.media[ 0 ].id;
                        //TODO this is a hokey way of indicating a link to another experience
                        a8API.updateMedia(mediaId, { remoteId: expId } )
                            .then( function(data){
                                $log.info("Media updated.");
                            })
                            .catch( function(err){
                                $log.info( "Media NOT updated, this is a problem." );
                            });
                        regService.clearUser();
                        $location.path( '/endslate' );
                    })
                    .catch( function(err){

                        $log.error( "Failed to create guest!" );
                        $location.path( '/endslate' );

                    });

            }
        };


        $scope.back = function () {
            $location.path( '/approve' );
        };

    } ] );
