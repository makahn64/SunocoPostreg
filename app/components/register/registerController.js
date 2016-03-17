app.controller( "regController", [ "$rootScope", "$scope", "$log", "ngToast", "$q", "a8API", "$timeout", "$location",
    "media", "regService", function ( $rootScope, $scope, $log, ngToast, $q, a8API, $timeout, $location, media, regService ) {

        $log.info( "regController be loaded." );

        $scope.ui = {
            ready:          false,
            msg:            "",
            firstNameError: false,
            lastNameError:  false
        };

        $scope.emails = [];

        $scope.user = regService.getUser();

        if ( !$scope.user ) {
            $scope.emails[0] = "";
            $scope.ui.msg = "Enter your information:";
            $scope.ui.ready = true;
        }
        else {
            $scope.ui.msg = "Confirm your information:";
            $scope.emails[0] = $scope.user.email;
            $scope.ui.ready = true;
        }

        function createGuest(email) {

            var guestObj = {
                firstName:   $scope.user.firstName,
                lastName:    $scope.user.lastName,
                email:       email
            };

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

        function createGuestAndExperience(email) {
            return createGuest(email)
                .then( createExperience )
                .then( function(res){
                    $log.info("Experience created!");
                    var expId = res.data.id;
                    var mediaId = res.data.media[ 0 ].id;
                    //TODO this is a hokey way of indicating a link to another experience
                    a8API.updateMedia(mediaId, { remoteId: expId } )
                        .then( function(){
                            $log.info("Media updated.");
                        })
                        .catch( function(){
                            $log.info( "Media NOT updated, this is a problem." );
                        });
                })
                .catch( function(){
                    $log.error( "Failed to create guest!" );
                });
        }

        function validate() {
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

        $scope.updateEmails = function(num) {

            if (num == 0) {  // adding an email
                $scope.emails.push("");

            } else {        // removing an email
                $scope.emails.splice(num, 1);
                for (var i = 0; i < $scope.emails.length; i++) {
                    console.log(i + ": " + $scope.emails[i]);
                }
            }
        };

        $scope.submit = function () {
            if ( validate() ) {

                var promises = [];

                $log.info( "Submitting user data for " + $scope.user.firstName );

                $scope.emails.forEach(function(email) {
                    $log.info(email);
                    if (email) {
                        promises.push(createGuestAndExperience(email));
                    }
                });

                $q.all(promises)
                    .then(function () {
                        $log.info("Done creating experiences!");
                        $location.path('/endslate');
                    })
                    .catch(function() {
                        $log.error("Error creating experiences");
                    });
            }
        };

        $scope.back = function () {
            $location.path( '/approve' );
        };

    } ] );
