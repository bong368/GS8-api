(function() {

    'use strict';

    angular
        .module('hokibetSlide', [])

        .directive('hokibetslide', function($timeout) {
            return {
                restrict: 'AE',
                replace: true,
                templateUrl: 'templates/directive/hokibetSlide.html',
                link: function(scope, elm, attrs) {
                    $timeout(function () {
                        $("ul.mainSlide").bxSlider({
                            mode:'horizontal',
                            speed: 1000,
                            auto: true,
                            pager: false,
                            controls: false,
                            adaptiveHeight: true
                        });
                        
                        $("ul.promoSlide").bxSlider({
                            mode:'vertical',
                            speed: 1000,
                            auto: true,
                            pager: false,
                            controls: false,
                            adaptiveHeight: true
                        });
                    });
                }
            };
        })

        .controller('slideController', function($scope) {

            $scope.mainSlides = [
                {src: '/images/slide/slide1_extra bonus.jpg'},
                {src: '/images/slide/slide 2-sportsbook.jpg'}
            ];

            $scope.promoTopSlides = [
                {src: '/images/slide/cash back smal banner.jpg'},
            ];

            $scope.promoBottomSlides = [
                {src: '/images/slide/banner rebate.jpg'},
                {src: '/images/slide/banner rebate1.jpg'},
            ];
        });
})();