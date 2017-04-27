(function () {
    'use strict';

    angular
        .module('bzWebOrder')
        .service('orderWebSvc', orderWebSvc)
        .factory('orderWebFac', orderWebFac);

    function orderWebFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.apiUrl + '/order/:method/:id_product/:quantity',
            { method: '@method', id_product: '@id_product', quantity: '@quantity' });
    }

    function orderWebSvc($q, $window, bzResourceSvc, orderWebFac) {
        return {
            sendOrder: sendOrder,
            checkCoupon: checkCoupon,

            getShippingFee: getShippingFee,
            getShippingAddressUser: getShippingAddressUser,
        };

        function sendOrder(data) {
            var orderWeb = new orderWebFac(data);
            return orderWeb.$save({});
        }

        function checkCoupon(data, code_coupon) {
            var order = new orderWebFac(data);
            return order.$save({ method: 'apply-coupon', id_product: code_coupon });
        }

        function getShippingFee() {
            var getData = new orderWebFac();
            return getData.$get({ method: 'list-shiping-fee' });
        }

        function getShippingAddressUser() {
            var getData = new orderWebFac();
            return getData.$get({ method: 'shiping-address-user' });
        }

    }
})();