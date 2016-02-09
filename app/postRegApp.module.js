
var app = angular.module('regApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'ngToast',
     'ngSanitize', 'ngTouch', 'appdWidgets', 'imageSpinner', 'toggle-switch', 'ngA8API2.service' ]);


app.run(function($rootScope, $log, $http, media, a8API ) {
    $log.info("postreg app running...");

    // defaults in case JSON is messed up
    $rootScope.settings = {
        "orientation" : "landscape",
        "aspect" : "16x9",
        "picsPerPage" : 6,
        "eventId" : 1,
        "customerFolder" : "sunoco",
        "collect" : [ "firstName", "lastName", "email" ]
    };

    // load in settings
    $http.get("appsettings.json").then(
        function(data) {
            $rootScope.settings = data.data;
            $rootScope.skin = {
                customerFolder: data.data.customerFolder,
                title: data.data.pageTitle
            };

            a8API.setSiteOrigin($rootScope.settings.a8SiteOrigin);
            // do initial media load
            media.load();
        },
        function() {
            $log.error("Couldn't load appsettings.json.");
        });
});


// some convenience methods for arrays

Array.prototype.clear = function() {
  while (this.length > 0) {
    this.pop();
  }
};

Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
};

Array.prototype.remove = function(obj) {
    var i = this.indexOf(obj);
    if (i != -1) {
        this.splice(i, 1);
    }
};




