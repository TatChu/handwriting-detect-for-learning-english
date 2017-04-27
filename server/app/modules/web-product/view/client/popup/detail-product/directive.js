(function () {
    'use strict';
    angular
        .module('bzApp')
        .directive('slickPopupProductDetail', slickPopupProductDetail);

    function slickPopupProductDetail($timeout, $parse) {
        return {
            scope: {
                atrOptions: '=atrOptions'
            },
            link: function ($scope, element, $attrs) {
                $timeout(function () {
                    element.slick($scope.atrOptions);
                }, 10);
            }
        };
    }
})();