(function () {
    'use strict';

    angular
        .module('bzUser')
        .service('userSvc', userSvc)
        .service('userFac', userFac)
        .service('userFacApi', userFacApi)
        .service('userSvcApi', userSvcApi);

    function userFac($window, customResourceSrv) {
        return customResourceSrv.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function userFacApi($window, customResourceSrv) {
        return customResourceSrv.api($window.settings.services.apiUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function userSvc($q, $window, customResourceSrv, userFac) {
        return {
            create: create,
            update: update,
        };

        function create(data, id) {
            var createData = new userFac(data);

            return createData.$save({ method: 'user' });
        }

        function update(data, id) {
            var createData = new userFac(data);
            return createData.$update({ method: 'user', id: id });
        }
    }

    function userSvcApi($q, $window, customResourceSrv, userFacApi) {
        return {
            requestRecogniton: requestRecogniton,
        };

        function requestRecogniton() {
            var req = new userFacApi();
            return req.$get({ method: 'user', id: 'request-recognition' });
        }
    }
})();