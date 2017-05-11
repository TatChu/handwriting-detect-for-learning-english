(function () {
    'use strict';

    angular
        .module('bsLearning')
        .service('LearnSvc', LearnSvc)
        .factory('LearnFac', LearnFac);

    function LearnFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.apiUrl + '/:method/:param1/:param2',
            { method: '@method', param1: '@param1', param2: '@param2' });
    }

    function LearnSvc($q, $window, bzResourceSvc, LearnFac) {
        return {
            recognition: recognition,
            processImage: processImage
        };

        function recognition() {
            var data = new LearnFac(data);
            return data.$save({ method: 'recognition' });
        }

        function processImage(data) {
            var fac = new LearnFac(data);
            return fac.$save({ method: 'process-img' });
        }

    }
})();