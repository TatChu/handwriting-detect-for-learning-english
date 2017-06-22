(function () {
    'use strict';

    angular
        .module('bsLearning')
        .service('LearnSvc', LearnSvc)
        .factory('LearnFac', LearnFac);

    function LearnFac($window, customResourceSrv) {
        return customResourceSrv.api($window.settings.services.apiUrl + '/:method/:param1/:param2',
            { method: '@method', param1: '@param1', param2: '@param2' });
    }

    function LearnSvc($q, $window, customResourceSrv, LearnFac) {
        return {
            recognition: recognition,
            processImage: processImage,
            autoCropImage: autoCropImage
        };

        function recognition(data) {
            var data = new LearnFac(data);
            return data.$save({ method: 'recognition' });
        }

        function processImage(data) {
            var fac = new LearnFac(data);
            return fac.$save({ method: 'process-img' });
        }

        function autoCropImage(data) {
            var fac = new LearnFac(data);
            return fac.$save({ method: 'auto-crop-img' });
        }
    }
})();