(function () {
    'use strict';

    angular
        .module('bzWebHome')
        .service('WebHomeSvc', WebHomeSvc)
        .factory('WebHomeFac', WebHomeFac);

    function WebHomeFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.webUrl + '/dat-hang/:method/:id_product/:quantity',
            { method: '@method', id_product: '@id_product', quantity: '@quantity' });
    }

    function WebHomeSvc($q, $window, bzResourceSvc, WebHomeFac) {
        return {
        };

    }
})();