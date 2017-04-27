(function () {
    'use strict';

    angular
        .module('bzUser')
        .service('userSvc', userSvc)
        .factory('userFac', userFac)

    function userFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function userSvc($q, $window, bzResourceSvc, userFac) {
        return {
            create: create,
            update: update,
            getRoles: getRoles,
        };

        function create(data, id) {
            var createData = new userFac(data);

            return createData.$save({ method: 'user' });
        }

        function update(data, id) {
            var createData = new userFac(data);

            return createData.$update({ method: 'user', id: id });
        }

        function getRoles() {
            var getData = new userFac();
            return getData.$get({ method: 'roles' });
        }
    }

})();