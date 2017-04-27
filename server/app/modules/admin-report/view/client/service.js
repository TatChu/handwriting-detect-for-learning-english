(function () {
    'use strict';

    angular
        .module('bzProduct')
        .service('reportSvc', reportSvc)
        .service('reportFac', reportFac);

    function reportFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function reportSvc($q, $window, bzResourceSvc, reportFac, apiFac) {
        return {
            reportProductOrder: reportProductOrder,
            reportProductADay: reportProductADay
        };

        function reportProductOrder(query) {
            query.method = 'report-product-order';
            var report = new reportFac();
            return report.$get(query);
        }

        function reportProductADay(query) {
            query.method = 'report-product-a-day';
            var report = new reportFac();
            return report.$get(query);
        }
    }
})();