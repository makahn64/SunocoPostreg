/**
 * Created by mkahn on 12/4/14.
 */

/**
 *
 * Lookup Screen Controller
 *
 */

app.controller("regController", [ "$rootScope", "$scope", "$log", "ngToast", "$q", "a8API", "$timeout", "$location",
    "media", "regService", function($rootScope, $scope, $log, ngToast, $q, a8API, $timeout, $location, media, regService) {

    $log.info("regController be loaded.");

    var eventId = $rootScope.settings.eventId;

    $scope.agePicker = [{ left: true, inner: false, right: false, label: '1-18', selected: false},
                    { left: false, inner: true, right: false, label: '19-35', selected: true},
                    { left: false, inner: false, right: true, label: '35+', selected: false} ];


    $scope.ageSelection = {};

    $scope.genderPicker = [{ left: true, inner: false, right: false, label: 'Male', selected: false},
                    { left: false, inner: true, right: false, label: 'Female', selected: false},
                    { left: false, inner: false, right: true, label: 'Unspecified', selected: true} ];


    $scope.genderSelection = {};

    $scope.guestModel = {firstName: "",
                    firstNamePlaceholder: "FIRST NAME (required)",
                    lastName:"",
                    lastNamePlaceholder: "LAST NAME (required)",
                    email:"",
                    emailPlaceholder: "EMAIL ADDRESS (required)",
                    spamMe: true,
                    phoneNumberPlaceholder: "PHONE NUMBER",
                    phoneNumber: "",
                    zipCodePlaceholder: "ZIP CODE",
                    zipCode: "",
                    xtra: "",
                    instructions: 'Please enter you information below to receive<br>your <span class="bold_white">Earn Your Armour Chicago Challenge</span> photo.'};


    function validate(){

        if ( !$scope.guestModel.firstName || !$scope.guestModel.lastName || !$scope.guestModel.email ){
             //ngToast.create("Please fill in first and last name!");
            $scope.showPopupModal("Please fill in name and email!");
            return false;
        }

        var validEmail = new RegExp("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}").test($scope.guestModel.email);
        if (!validEmail){
            $scope.showPopupModal("Please enter a valid email!");
            return false;
        }

      return true;
    }


    function createGuest(){

        var localEmail = $scope.guestModel.email;
        if (!localEmail){
            localEmail = "no-email-given@test.com";
        }

        var gender = $scope.genderSelection.label.toLowerCase();
        if (gender == "unspecified"){
            gender = "declined to state";
        }

        return a8API.registerGuest({
            firstName: $scope.guestModel.firstName,
            lastName: $scope.guestModel.lastName,
            email: localEmail,
            demographics: {
                age: $scope.ageSelection.label,
                gender: gender
            },
            address: {
                zip: $scope.guestModel.zipCode
            },
            mobilePhone: $scope.guestModel.phoneNumber

            // TODO: figure out where this goes
            //wantsSpam: $scope.guestModel.spamMe,
        });
    }


    function createExperience(gid){

        // TODO: media don't have a links.experience field, so how do I use existing experiences?
        /*if ($rootScope.settings.useExistingExperience){

            var expId = media.getPicked().links.experience;

            a8API.editExperience({ id: expId, owner: gid, readyForUpload:1}).then(
                function(data){
                    d.resolve();
                    if ($rootScope.settings.flagAfterShare) {
                        updateResource('photos', media.getPicked().id, {flagged: true});
                        media.load(); //kick that fucker
                    }
                },
                function(err){
                    d.reject();
                }
            );*/


        //} else {

            return a8API.addExperience({
                media: [media.getPicked().id],
                guests: [gid],
                event: {
                    id: eventId
                }
                // TODO: experienceName?
                // TODO: does sendEmail = $scope.guestModel.spamMe?
            });

        }


    $scope.reg = function(){
        if (validate()) {
            createGuest().then(
                function(data) {

                    createExperience(data.data.id).then(
                        function() {
                            var flags = media.getPicked().flags;
                            flags.shared = true;

                            if ($rootScope.settings.flagAfterShare) {
                                a8API.flagMedia(media.getPicked().id, flags);
                                media.load(); //kick that fucker
                            }

                            $location.path('/endslate');
                        },
                        function(err) {
                            $log.error("Error creating experience: " + err);
                            $scope.showPopupModal("Email Failed");
                        }
                    );
                },
                function(err) {
                    $log.error("Error creating guest: " + err);
                    ngToast.create("Registration failed!");
                }
            )
        }
    };


    $scope.back = function(){
        $location.path('/approve');
    };

}]);
