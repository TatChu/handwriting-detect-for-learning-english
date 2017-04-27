(function () {
    'use strict';

    angular
        .module('bzOrder')
        .service('orderSvc', orderSvc)
        .service('orderFac', orderFac);

    function orderFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function orderSvc($q, $window, bzResourceSvc, orderFac) {
        return {
            getAll: getAll,
            add: add,
            create: create,
            edit: edit,
            update: update,
            delete: del,
            checkCoupon: checkCoupon,
            formatCurrency: formatCurrency,
            isFirstOrder: isFirstOrder
        };

        function getAll(query) {
            query.method = 'order';
            var data = new orderFac();
            return data.$get(query);
        }

        function add() {
            var data = new orderFac();
            return data.$get({ method: 'order-add' });
        }

        function create(data) {
            var data = new orderFac(data);
            return data.$save({ method: 'order' });
        }

        function edit(id) {
            var data = new orderFac();
            return data.$get({ method: 'order', id: id });
        }

        function update(data_send, id) {
            var data = new orderFac(data_send);
            return data.$save({ method: 'order', id: id });
        }

        function del(id) {
            var data = new orderFac();
            return data.$delete({ method: 'order', id: id });
        }

        function formatCurrency(money) {
            return money.toFixed().replace(/./g, function (c, i, a) {
                return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "." + c : c;
            });
        }

        function checkCoupon(order, coupon) {
            var data = new orderFac(order);
            return data.$save({ method: 'check-coupon', id: coupon });
        }

        function isFirstOrder(user_id) {
            var data = new orderFac();
            return data.$get({ method: 'is-first-order', id: user_id });
        }
    }
})();