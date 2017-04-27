(function () {
    'use strict';

    angular
        .module('bzCertificate')
        .factory('certificateFac', certificateFac)
        .service('certificateSvc', certificateSvc);

    function certificateFac(bzResourceSvc) {
        return bzResourceSvc.api(settingJs.configs.adminUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function certificateSvc($q, certificateFac) {
        return {
            getAll: getAll,
            get: get,
            create: create,
            update: update,
            getProductsByCerID : getProductsByCerID,
        };

        function getAll() {
            var list = new certificateFac();
            // console.log(createData);

            return list.$get({ method: 'certificate' });
        }

        function get(id) {
            var getByID = new certificateFac();
            return getByID.$get({ method: 'certificate', id: id });
        }

        function create(data) {
            var createData = new certificateFac(data);
            return createData.$save({ method: 'certificate' });
        }

        function update(data, id) {
            var updateData = new certificateFac(data);

            return updateData.$update({ method: 'certificate', id: id });
        }
        function getProductsByCerID(data,id) {
            var getProductsByCerID = new certificateFac(data);

            return getProductsByCerID.$get({ method: 'certificate-product', id: id });
        }
    }
})();