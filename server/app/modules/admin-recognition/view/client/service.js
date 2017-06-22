(function () {
    'use strict';

    angular
        .module('bsRecognition')
        .service('recognitionSrv', recognitionSrv)
        .factory('recognitionFac', recognitionFac)
        .factory('recognitionApiFac', recognitionApiFac);


    function recognitionFac($window, customResourceSrv) {
        return customResourceSrv.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function recognitionApiFac($window, customResourceSrv) {
        return customResourceSrv.api($window.settings.services.apiUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function recognitionSrv($q, $window, customResourceSrv, recognitionFac, recognitionApiFac) {
        return {
            updateJson: updateJson,
        };

     
        function updateJson(data) {
            var updateJsonF = new recognitionFac(data);
            return updateJsonF.$save({ method: 'update-json' });
        }

    }
})();