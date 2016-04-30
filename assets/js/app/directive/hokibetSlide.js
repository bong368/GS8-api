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
                {src: '/images/slide/slide1-extrabonus-indo.jpg'},
                {src: '/images/slide/slide2-sportsbook-indo.jpg'},
                {src: '/images/slide/slide3-live casino-indo.jpg'},
                {src: '/images/slide/slide4-slotgames-indo.jpg'}
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