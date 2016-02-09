app.factory('media',
    function ($rootScope, $http, $filter, a8API, $log) {

        var service = {};

        var picked = undefined;   // media item that is picked
        var allMedia = [];        // array of all media objects


        service.getAll = function () {
            return allMedia;
        };


        service.load = function () {
            return a8API.getResource('media', 'limit=18&sort=uploadedAt DESC&remoteId=').then(
                function (data) {

                    allMedia = [];
                    data.forEach( function(m){

                        m["downloadUrl"] = a8API.getSiteOrigin()+'/media/download/'+m.id;
                        allMedia.push(m);

                    });

                    $rootScope.$broadcast('refreshPics');

                },
                function (err) {
                    $log.error("Error retrieving photos: " + err);
                });

        };


        service.setPicked = function (p) {
            picked = p;
        };


        service.getPicked = function () {
            return picked;
        };


        return service;

    });
