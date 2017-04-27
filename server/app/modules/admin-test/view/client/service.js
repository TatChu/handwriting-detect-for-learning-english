(function () {
    'use strict';

    angular
        .module('bzTest')
        .service('testSvc', testSvc)
        .factory('testFac', testFac)
        .factory('testApiFac', testApiFac);


    function testFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function testApiFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.apiUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function testSvc($q, $window, bzResourceSvc, testFac, testApiFac) {
        return {
            resize: resize,
            uploadBase64: uploadBase64
        };

        function resize(data) {
            var resizeData = new testFac(data);
            return resizeData.$save({ method: 'resize-img' });
        }

        function uploadBase64(data) {
            var uploadBase64Data = new testApiFac(data);
            return uploadBase64Data.$save({ method: 'upload', id: 'base64' });
        }

    }
})();