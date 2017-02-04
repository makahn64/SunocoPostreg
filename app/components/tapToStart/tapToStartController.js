app.controller("tapToStartController",[ "$scope", "$location", function($scope, $location) {

    console.log("tapToStartController loaded");

    var TAPS_FOR_SETTINGS = 5;
    var TAP_TIMEOUT = 1000;

    var taps = [];

    $scope.upperLeftTap = function() {

    	if (taps.length < TAPS_FOR_SETTINGS) {
    		taps.push(new Date().getTime());
    	}

    	else {
    		var diff = taps[taps.length - 1] - taps[0];
    		if (diff <= TAP_TIMEOUT) {
    			$location.path("/setup");
    		}

    		taps.shift();
    		taps.push(new Date().getTime());
    	;}
    }
}]);