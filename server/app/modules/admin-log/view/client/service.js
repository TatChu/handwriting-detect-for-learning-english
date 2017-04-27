(function () {
    'use strict';

    angular
        .module('bzAuditLog')
        .service('auditLogSvc', auditLogSvc)
        .factory('auditLogFac', auditLogFac);

    function auditLogFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function auditLogSvc($q, $window, bzResourceSvc, auditLogFac) {
        return {
            getLog: getLog,
        };

        function getLog(config) {
            config.method = 'log';
            var auditLogFactory = new auditLogFac();
            return auditLogFactory.$get(config);
        }

    }
})();