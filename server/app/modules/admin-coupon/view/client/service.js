(function () {
    'use strict';

    angular
        .module('bzCoupon')
        .factory('couponFac', couponFac)
        .service('couponSvc', couponSvc);

    function couponFac(bzResourceSvc) {
        return bzResourceSvc.api(settingJs.configs.adminUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function couponSvc($q, couponFac) {
        return {
            getAll: getAll,
            get: get,
            create: create,
            update: update,
            getByCode: getByCode
        };

        function getAll() {
            var list = new couponFac();
            // console.log(createData);

            return list.$get({ method: 'coupon' });
        }

        function get(id) {
            var getByID = new couponFac();
            // console.log(createData);

            return getByID.$get({ method: 'coupon', id: id });
        }

        function create(data) {
            // console.log(data);
            var createData = new couponFac(data);
            // console.log(createData);

            return createData.$save({ method: 'coupon' });
        }

        function update(data, id) {
            var updateData = new couponFac(data);

            return updateData.$update({ method: 'coupon', id: id });
        }

        function getByCode(code) {
            var getByCode = new couponFac();
            return getByCode.$get({ method: 'coupon-code', id: code });
        }
    }
})();