(function () {
    'use strict';

    angular
        .module('bzPermisstion')
        .service('permissionSvc', permissionSvc)
        .service('permissionFac', permissionFac);

    function permissionFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:param1/:param2', { method: '@method', param1: '@param1', param2: '@param2' });
    }

    function permissionSvc($q, $window, bzResourceSvc, permissionFac) {
        return {
            create: create,
            get: get,
            update: update,
            getResoureRole: getResoureRole,
            addResource: addResource,
            removeRole: removeRole,
            removeResource: removeResource

        };

        function create(data, id) {
            var createData = new permissionFac(data);
            return createData.$save({ method: 'permission' });
        }

        function get() {
            var getFac = new permissionFac();
            return getFac.$get({ method: 'permission' });
        }

        function removeRole(role) {
            var deleteData = new permissionFac();
            return deleteData.$remove({ method: 'delete-role', param1: role });
        }
        function removeResource(role, resource) {
            var deleteData = new permissionFac();
            return deleteData.$remove({ method: 'delete-resource', param1: role, param2: resource });
        }

        function update(data, role, resource) {
            var putData = new permissionFac(data);
            return putData.$update({ method: 'permission', param1: role, param2: resource });
        }

        function getResoureRole(role) {
            var getFac = new permissionFac();
            return getFac.$get({ method: 'resources', param1: role });
        }

        function addResource(data, role) {
            var putData = new permissionFac(data);
            return putData.$update({ method: 'add-resource', param1: role });
        }
    }
})();