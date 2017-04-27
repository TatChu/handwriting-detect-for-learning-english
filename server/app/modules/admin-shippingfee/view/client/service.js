(function () {
    'use strict';

    angular
        .module('bzShippingFee')
        .factory('shippingfeeFac', shippingfeeFac)
        .service('shippingfeeSvc', shippingfeeSvc);

    function shippingfeeFac(bzResourceSvc) {
        return bzResourceSvc.api(settingJs.configs.adminUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function shippingfeeSvc($q, shippingfeeFac) {
        return {
            getAll: getAll,
            getShippingFeeDefault: getShippingFeeDefault,
            getAllNoPaging: getAllNoPaging,
            get: get,
            create: create,
            update: update,
        };

        function getAll() {
            var list = new shippingfeeFac();
            return list.$get({ method: 'shippingfee' });
        }
        function getAllNoPaging() {
            var list = new shippingfeeFac();
            // console.log(createData);

            return list.$get({ method: 'all-shippingfee' });
        }

        function getShippingFeeDefault() {
            var list = new shippingfeeFac();
            return list.$get({ method: 'all-shippingfee-config' });
        }

        function getAllNoPaging() {
            var list = new shippingfeeFac();
            return list.$get({ method: 'all-shippingfee' });
        }

        function get(id) {
            var getByID = new shippingfeeFac();
            // console.log(createData);

            return getByID.$get({ method: 'shippingfee', id: id });
        }

        function create(data) {
            // console.log(data);
            var createData = new shippingfeeFac(data);
            // console.log(createData);

            return createData.$save({ method: 'shippingfee' });
        }

        function update(data, id) {
            var updateData = new shippingfeeFac(data);

            return updateData.$update({ method: 'shippingfee', id: id });
        }
    }
})();