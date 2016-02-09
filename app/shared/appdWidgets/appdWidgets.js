/**
 * Created by mkahn on 12/27/14.
 */

angular.module('appdWidgets',[])

.directive('dotPager', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        template: '<div class="appd-pager"> <div ng-transclude></div><br> </div>',
        scope: { activePage: "="},
        controller: function($scope) {

            $scope.dots = [];
            this.gotSelected = function(selectedDot) {
                angular.forEach($scope.dots, function(dot) {
                    if (selectedDot != dot) {
                        dot.selected = false;
                    }
                });
            }

            this.addDot = function(dot) {
                $scope.dots.push(dot);
                $scope.dots[0].selected = true;
            } },
        link: function(scope, elem, attrib){
            scope.$watch('activePage', function(newActive){
                if (scope.dots.length>0){
                    scope.dots[newActive].tapped();
                }
            });
        }
    }
})


.directive('pagerDot', function(){
    return {
        restrict: 'E',
        template: '<div class="appd-pager-dot" ng-class="{\'appd-pager-dot-selected\': selected }" ng-click="tapped()">\u25C9</div>',
        require: '^?dotPager',
        scope: {
            dotNumber: "=",
            callback: "="
        },
        link: function ( scope , element, attrs, dotPagerController ){

            scope.selected = false;

            dotPagerController.addDot(scope);

            scope.tapped = function(){
                scope.selected = true;
                dotPagerController.gotSelected(scope);
                if (scope.callback){
                    scope.callback(scope.dotNumber);
                }
            }
        }
    }

})

// Needs work

.directive('imgLoader', function(){


    var loadingDefault = "assets/img/loading.jpg";

    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            attr.$set('src', loadingDefault);
            element.bind('load', function() {
                console.log('image is loaded');
            });

            }

    }

})

.directive('adToast', function(){
    return {
        restrict: 'E',
        template: '<div class="modal-holder animate-show deep-shadow" ng-show="showToast"><div>{{adToastMessage}}</div></div>',
        scope: { adToastMessage: "=",
                 showToast: "=" }

    }

})


.directive('sampleDirective', function(){
    return {
        restrict: 'E',
        template: '<div style="color: red">And the title is {{fixedTitle}}</div>',
        scope: { title: "@myTitle" },
        link: function( scope, element, attrs ) {
            scope.fixedTitle = scope.title.toUpperCase();
        }
    }

})

// segments is an array of objects with these properties: left, inner, right, label, selected
.directive('segControl', function(){
    return {
        restrict: 'E',
        templateUrl: 'app/shared/appdWidgets/adSegControl.partial.html',
        scope: {
            segments: "=",
            selected: "="
        },
        link: function ( scope , element, attrs ){

            scope.selected = {};

            //initialize fist time
            scope.segments.forEach(function(seg){
                if (seg.selected)
                {
                   scope.selected = seg;
                } });

            scope.segmentClicked = function(num){
                if (!attrs.multi){
                    scope.segments.forEach(function(seg){ seg.selected=false; });
                }
                scope.segments[num].selected = true;
                scope.selected = scope.segments[num];
            }


        }
    }

})