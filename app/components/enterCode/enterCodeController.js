app.controller("enterCodeController", ["$rootScope", "$scope", "$q", "$timeout", "$log", "regService",
    function ($rootScope, $scope, $q, $timeout, $log, regService) {

        $log.info("enterCodeController be loaded.");

        $scope.CODE_LENGTH = 7;
        $scope.code = "";

        $scope.ui = {
            msg: "If you are a Daytona Rewards member, enter your 7-digit code:",
            showNumpad: true,
            registered: false,
            regFail: false
        };

        $scope.user = undefined;

        $scope.enterDigit = function(digit) {
            if ($scope.code.length < $scope.CODE_LENGTH)
                $scope.code += digit;
        };

        $scope.delete = function() {
            $scope.code = $scope.code.slice(0, -1);
        };

        $scope.register = function() {
            $scope.ui.showNumpad = false;
            $scope.ui.msg = "Registration in process...";
            $log.info("Registering with code " + $scope.code);

            regService.register($scope.code).then(
                function(user) {
                    $scope.user = user;
                    $scope.ui.msg = "";
                    $scope.ui.registered = true;
                },
                function(err) {
                    $log.error("Error registering: " + err);
                    $scope.regFailure();
                });
        };

        $scope.regFailure = function() {
            $scope.ui.msg = "";
            $scope.ui.showNumpad = false;
            $scope.ui.registered = false;
            $scope.ui.regFail = true;
            regService.clearUser();
        };

        $scope.reEnter = function() {
            $scope.code = "";
            $scope.ui = {
                msg: "If you are a Daytona Rewards member, enter your 7-digit code:",
                showNumpad: true,
                registered: false,
                regFail: false
            };
        }

    }]);
