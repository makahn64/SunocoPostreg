
var app = angular.module('regApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'ngToast', 'ngIdle',
     'ngSanitize', 'ngTouch', 'appdWidgets', 'imageSpinner', 'toggle-switch', 'ngA8API2.service', 'userdefaults.service', 'nodeA8.service' ]);

app.config(['IdleProvider', 'KeepaliveProvider', function(IdleProvider, KeepaliveProvider) {
    IdleProvider.idle(3*60);
    IdleProvider.timeout(1);
}]);

app.run(function($rootScope, $log, $http, $location, Idle, media, a8API, userDefaults) {
    $log.info("postreg app running...");

    Idle.watch();

    $rootScope.$on('IdleTimeout', function() {
        $log.info('Session timeout, redirecting home.');
        $location.path('/');
        Idle.watch();
    });

    // defaults in case JSON is messed up
    $rootScope.settings = {
        "orientation":           "landscape",
        "aspect":                "16x9",
        "picsPerPage":           6,
        "eventId":               1,
        "customerFolder":        "sunoco",
        "pageTitle":             "Sunoco Celebration Cam",
        "nukeAfterShare":        true,
        "flagAfterShare":        true,
        "useExistingExperience": true,
        "collect":               [ "firstName", "lastName", "email" ],
        "a8SiteOrigin":          "http://127.0.0.1:1337/api/v2"
    }

    $rootScope.skin = {
        customerFolder: $rootScope.settings.customerFolder,
        title:          $rootScope.settings.pageTitle
    };

    var savedOrigin = userDefaults.getStringForKey( "a8SiteOrigin", "" );
    if ( savedOrigin ) {
        $rootScope.settings.a8SiteOrigin = savedOrigin;
    }

    $log.info( "Setting a8 site origin to " + $rootScope.settings.a8SiteOrigin );
    a8API.setSiteOrigin( $rootScope.settings.a8SiteOrigin );
    // do initial media load
    media.load();

    // MAK took this out. Causing problems with latest ANgular 2017
    // load in settings
    // $http.get("appsettings.json").then(
    //     function(data) {
    //         $rootScope.settings = data.data;
    //         $rootScope.skin = {
    //             customerFolder: data.data.customerFolder,
    //             title: data.data.pageTitle
    //         };
    //
    //         var savedOrigin = userDefaults.getStringForKey("a8SiteOrigin", "");
    //         if (savedOrigin) {
    //             $rootScope.settings.a8SiteOrigin = savedOrigin;
    //         }
    //
    //         $log.info("Setting a8 site origin to " + $rootScope.settings.a8SiteOrigin);
    //         a8API.setSiteOrigin($rootScope.settings.a8SiteOrigin);
    //         // do initial media load
    //         media.load();
    //     },
    //     function() {
    //         $log.error("Couldn't load appsettings.json.");
    //     });
});


app.directive('hiddenHome', function(){



})

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




