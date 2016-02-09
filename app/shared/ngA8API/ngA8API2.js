/**
 * Originally created by mkahn on 4/28/15.
 * Rewritten August/Sep 2015
 *
 * And again in Oct 2015 for V2
 *
 * Module rewritten to conform with latest promises implementation in Angular 1.4+
 *
 */


angular.module('ngA8API2.service', [])
    .factory('a8API', function ($http, $q, $rootScope, $log) {

                 var service = {};

                 //Do this so it is not hard coded (except port).
                 var _siteOrigin = window.document.location.protocol + "//" + window.document.location.hostname;
                 if (_apiServerPort) {
                     _siteOrigin = _siteOrigin + ':' + _apiServerPort + '/api/v2';
                 }

                 /**
                  * Change site origin from the default. Also resets the auth status. Must include port number.
                  * @param origin
                  */
                 service.setSiteOrigin = function (origin) {
                     _siteOrigin = origin;
                     //service.logout();
                 }

                 /**
                  * Return site origin
                  * @returns {string}
                  */
                 service.getSiteOrigin = function () {
                     return _siteOrigin;
                 }


                 // In all cases, errors bubble up...for now

                 service.getResource = function (resourceName, queryString) {

                     var endpoint = _siteOrigin + "/" + resourceName;
                     if (queryString)
                         endpoint = endpoint + '?' + queryString;

                     return $http.get(endpoint)
                         .then(function (data) {
                                   return data.data;
                               });

                 }

                 service.deleteResource = function (resourceName, id) {

                     var endpoint = _siteOrigin + "/" + resourceName + "/" + id;
                     return $http.delete(endpoint)
                         .then(function (data) {
                                   return data.data;
                               });

                 }


                 // CONVENIENCE METHODS for GUESTS

                 service.registerGuest = function (guestData) {

                    return $q( function(resolve, reject ){

                        //First, see if guest already is registered

                        if (!guestData.email)
                            reject(new Error("Email required!"));
                        service.getGuestByEmail(guestData.email)
                            .then( resolve )
                            .catch( function(err){
                                //No guest, or other error. Try a create.
                                var endpoint = _siteOrigin + "/guest";
                                resolve( $http.post( endpoint, guestData )
                                    .then( function(res){
                                        return res.data;
                                    }));
                            })

                    });


                 };

                 //TODO this needs to be in the controller on the server side
                 service.getGuestByEmail = function(email){

                    var endpoint = _siteOrigin + '/guest?email=' + email;
                    return $http.get(endpoint)
                        .then( function(res){
                            if (res.data.length>0){
                                $log.info( "a8API: found existing guest for email: " + email );
                                return res.data[ 0 ];
                            }
                            throw new Error("No such email: "+email);

                        });

                 }

                service.editGuest = function (guestData){
                    if(!guestData || !guestData.id){
                        return $q.reject({message:"Make sure that an id is supplied in guestData"});
                    }
                    var endpoint = _siteOrigin + "/guest/" + guestData.id;
                    return $http.put(endpoint, guestData);
                }


                 // CONVENIENCE METHODS FOR SIMULATOR

                 service.getSimulatedGuests = function () {

                     var endpoint = _siteOrigin + '/guest?where={"metadata: {simulated:"true"}}';
                     return $http.get(endpoint);

                 }

                 service.getSimulatedExperiences = function () {

                     var endpoint = _siteOrigin + '/experience?where={"metadata: {simulated:"true"}}';
                     return $http.get(endpoint);

                 }

                 service.getSimulatedQueues = function () {

                     var endpoint = _siteOrigin + '/queue?where={"metadata: {simulated:"true"}}';
                     return $http.get(endpoint);

                 }

                 // CONVENIENCE METHODS for EXPERIENCES

                 /**
                  *
                  * Adds and experience object to the Activ8or server
                  * @param experienceObj
                  * @returns {*}
                  */
                 service.addExperience = function (experienceObj) {

                     var endpoint = _siteOrigin + "/experience";
                     return $http.post(endpoint, experienceObj);

                 };

                 /**
                  * Get the count of a number of objects
                  * @param objectType
                  * @returns {deferred.promise|*}
                  */
                 service.getCount = function (objectType) {

                     return $http.get(_siteOrigin + "/" + objectType + '/count')
                         .then(function (data) {
                                   return data.data;
                               });

                 }

                  service.editExperience = function (expData){
                       if(!expData || !expData.id){
                           return $q.reject({message:"Make sure that an id is supplied in expData"});
                       }
                       var endpoint = _siteOrigin + "/experience/" + expData.id;
                       return $http.put(endpoint, expData);
                   };
                 /**
                  * Upload a media file. If there is an experience Id, then the photo is attached to the
                  * experience.
                  * @param file
                  * @returns {deferred.promise|*}
                  */

                 service.uploadMedia = function (file, experienceId) {

                     var fd = new FormData();
                     fd.append('file', file);

                     if (experienceId) {
                         fd.append('experienceId', experienceId);
                     }

                     //fd.append('id', guestId);
                     // Content-Type undefined supposedly required here, transformed elsewhere
                     return $http.post(_siteOrigin + '/media/upload', fd, {
                         transformRequest: angular.identity,
                         headers: {'Content-Type': undefined}
                     });

                 }

                 service.updateMedia = function( mediaId, updateObject){
                    var endpoint = _siteOrigin+'/media/'+mediaId;
                    return $http.put(endpoint, updateObject);
                 }

                 //convenience methods for queue

                 service.addQueueEntry = function (queueEntryData) {

                     var endpoint = _siteOrigin + "/queue";
                     return $http.post(endpoint, queueEntryData);
                 };

                service.createQueue = function(queueEntryData) {
                    var endpoint = _siteOrigin + "/queue" + "/initializeQueue";
                    return $http.post(endpoint, queueEntryData);
                }

                 /**
                  * Documentation?
                  * @param guestId
                  * @param options
                  * @returns {HttpPromise}
                  */
                 service.completeQueueEntry = function (guestId, options) {

                     if (guestId != undefined && options != undefined) {

                         options.completed = Date.now();
                         var endpoint = _siteOrigin + '/queue/' + guestId;
                         return $http.put(endpoint, options);

                     } else {
                         throw new Error("need additional info");
                     }

                 };

                 service.popFromQueueNamed = function (queueName) {
                     var endpoint = _siteOrigin + "/queue/pop?queueName=" + queueName;
                     return $http.get(endpoint)
                         .then(function (data) {
                                   return data.data;
                               });
                 };

                 //convenience methods for watchdog

                 //TODO What is the JSON.stringify stuff?
                 service.addWatchdog = function (watchdogData) {

                     var endpoint = _siteOrigin + "/watchdog";
                     if (watchdogData.contactsArr) {
                         watchdogData.contacts = JSON.stringify(watchdogData.contactsArr);
                     }
                     return $http.post(endpoint, watchdogData);
                 };

                 service.pingWatchdog = function (watchdogData) {

                     var endpoint = _siteOrigin + "/watchdog/ping";
                     return $http.post(endpoint, watchdogData);

                 };

                 service.changeWatchDogEntry = function (dogId, options) {

                     if (dogId != undefined && options != undefined) {
                         options = {contacts: options.contacts, alarmInterval: options.alarmInterval};
                         var endpoint = _siteOrigin + '/watchdog/' + dogId;
                         return $http.put(endpoint, options);
                     } else {
                         throw new Error("need additional info");
                     }

                 };


                 //convenience methods for users
                 //TODO Users not implemented in this version
                 service.addUser = function (userData) {

                     var endpoint = _siteOrigin + "/user";
                     return $http.post(endpoint, userData);

                 };


                 //convenience methods for report recipients

                 service.updateSettings = function (id, options) {

                     var endpoint = _siteOrigin + "/settings/" + id;
                     return $http.put(endpoint, options);
                 };

                 service.getNotificationSettings = function () {
                     var stuff = {};

                     var resource = "settings";

                     var promise1 = service.getResource(resource, "key=twilioSettings");
                     var promise2 = service.getResource(resource, "key=sendgridSettings");

                     return $q.all([promise1, promise2]);
                 };

                 //convenience methods for scrapers

                 service.getInstagramMedia = function () {
                     return service.getResource('media', 'source=instagram');
                 };

                 service.getTweets = function () {
                     return service.getResource('media', 'source=twitter');
                 };

                 service.flagMedia = function (id, definedFlags) {
                     return $http.put(_siteOrigin + "/media/" + id, {flags: definedFlags});
                 };


                 service.getCountOfResourceInLastDay = function (resource) {
                     var current = Date.now();
                     var aDayAgo = current - 1000 * 60 * 60 * 24;
                     return $http.post(_siteOrigin + "/" + resource + "/count", {start: aDayAgo, end: current});
                 }

                 service.getCountOfResourceInLastHour = function (resource) {
                     var current = Date.now();
                     var anHourAgo = current - 1000 * 60 * 60;
                     return $http.post(_siteOrigin + "/" + resource + "/count", {start: anHourAgo, end: current});
                 }

                 service.addEvent = function (eventData) {
                     var endpoint = _siteOrigin + "/event";
                     return $http.post(endpoint, eventData);
                 }

                 service.addVenue = function (venueData) {
                     var endpoint = _siteOrigin + '/venue';
                     return $http.post(endpoint, venueData);
                 }

                 service.addSubVenue = function (barData) {
                     var endpoint = _siteOrigin + '/subVenue';
                     return $http.post(endpoint, barData);
                 }

                 service.addEmailTemplate = function (emailTemplateData){
                     var endpoint = _siteOrigin + '/emailTemplate';
                     return $http.post(endpoint, emailTemplateData);
                 }

                 service.printMedia = function (mediaId) {

                     var endpoint = _siteOrigin + "/media/print/" + mediaId;
                     return $http.post(endpoint);

                 }

                 //FISH convenience methods

                 service.getFishGuest = function(badgeId){

                    var endpoint = _siteOrigin + "/fish/getGuest?badgeId=" + badgeId;
                    return $http.get(endpoint);

                 }

                 /********************************
                  *
                  * STUFF THAT WILL NEED CLEANUP
                  *
                  */

                 var _apiToken;

                 //set falsey if no port
                 var _apiServerPort = '1337';

                 //Do this so it is not hard coded (except port).
                 var _siteOrigin = window.document.location.protocol + "//" + window.document.location.hostname;
                 if (_apiServerPort) {
                     _siteOrigin = _siteOrigin + ':' + _apiServerPort + '/api/v2';
                 }

                 service.authorized = false;
                 service.bypassAuth = true; //for testing

                 service.isAuthorized = function () {

                     return ( service.authorized || service.bypassAuth );

                 }

                 /**
                  * Change site origin from the default. Also resets the auth status. Must include port number.
                  * @param origin
                  */
                 service.setSiteOrigin = function (origin) {
                     _siteOrigin = origin;
                     //service.logout();
                 }

                 /**
                  * Return site origin
                  * @returns {string}
                  */
                 service.getSiteOrigin = function () {

                     return _siteOrigin;

                 }


                 /**
                  * Effectively logs out by deleting the local token.
                  *
                  */

                     //TODO implement a logout on the server side?
                 service.logout = function () {
                     $rootScope.$broadcast('NOT-AUTHORIZED');
                     return $http.post(_siteOrigin+'/user/logout');
                 }


                 /**
                  * Common error handler for errors communicating with A8
                  * @param data
                  * @param status
                  * @param promise
                  */
                 function handleRESTError(data, status, promise) {

                     $log.warn("ngActv8API: Handling REST error with status: " + status);

                     var a8Error = new A8ErrorObject();

                     a8Error
                         .setStatus(status)
                         .setErrObject(data);

                     if (data !== null) {
                         a8Error.setType(data.error || 'net');
                     }

                     switch (status) {
                         case 400:
                             //Usually malformed data
                             switch (a8Error.type) {
                                 case 'E_VALIDATION':
                                     //A number of things could be wrong here, but the most common is either duplicated email
                                     //or invalid email format.
                                     for (var property in data.invalidAttributes) {
                                         if (data.invalidAttributes.hasOwnProperty(property)) {
                                             a8Error.setMessage(data.model + ': ' + property + ' violated rule: ' + data.invalidAttributes[property][0].rule);
                                         }
                                     }

                                     break;

                                 default:
                                     a8Error.setMessage('Unusual error of type: ' + a8Error.type); // kind of redundant

                             }
                             break;
                         case 401:
                             $log.warn("Unauthorized, removing local auth info.");
                             a8Error.setMessage("Unauthorized for that operation.");
                             service.logout();
                             break;
                     }

                     promise.reject(a8Error);

                 }


                 service.checkAuthorization = function () {

                     return $http.get(_siteOrigin + '/user/isauthenticated');

                 }


                 service.authorize = function (user, pass) {

                     return $http.post(_siteOrigin+'/user/login', {username: user, password: pass});

                 }

                 return service;
             });