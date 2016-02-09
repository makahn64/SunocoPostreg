/**
 * Created by mkahn on 12/4/14.
 */

/**
 *
 * Picker Screen Controller
 *
 */

app.controller("approveController",[ "$scope", "media", "$location", function($scope, media, $location) {

    console.log("approveController be loaded.");

    $scope.p = media.getPicked();

    $scope.back = function(){
        $location.path("/picker");
    };

    $scope.reg = function(){
        $location.path("/register");
    };

}]);