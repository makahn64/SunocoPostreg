app.factory('regService', ["$timeout", "a8API",
    function ($timeout, a8API) {


        var MODE = '';
        var service = {};

        var user = undefined;


        service.getUser = function() {
            return user;
        };

        service.clearUser = function() {
            user = undefined;
        };

        service.register = function(code) {

            if (MODE=='test'){

                return $timeout( function () {
                    user = {
                        firstName: "Bob",
                        lastName:  "Bob",
                        email:     "bob@bob.com"
                    };
                    return user;
                }, 1500 );

            } else {

                return a8API.getFishGuest(code)
                    .then(function (res){

                        var fishGuest = res.data;
                        user = {
                            firstName: fishGuest.first_name,
                            lastName: fishGuest.last_name,
                            email: fishGuest.email,
                            badgeId: fishGuest.badge_id
                        }
                        return user;

                    });

            }

        };

        return service;

    }]);
