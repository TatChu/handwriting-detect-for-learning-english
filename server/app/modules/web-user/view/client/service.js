(function () {
    'use strict';

    angular
        .module('bzUser')
        .service('userSvc', userSvc)
        .service('userFac', userFac)
        .service('userFacApi', userFacApi)
        .service('userSvcApi', userSvcApi);

    function userFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function userFacApi($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.apiUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function userSvc($q, $window, bzResourceSvc, userFac) {
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

    function userSvcApi($q, $window, bzResourceSvc, userFacApi) {
        return {
            updateFavoriteProduct: updateFavoriteProduct
        };

        function updateFavoriteProduct(data, id) {
            var createData = new userFacApi(data);

            return createData.$update({ method: 'user-favorite-product', id: id });
        }
    }
})();