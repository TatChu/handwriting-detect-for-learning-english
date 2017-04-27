; (function () {
    'use strict';

    Application.registerRouter({
        state: 'coupon-create',
        config: {
            url: '/coupon-create',
            data: {
                title: 'Coupon',
                menuType: 'coupon'
            },
            templateUrl: 'modules/admin-coupon/view/client/create-coupon/view.html',
            controller: 'couponAddCtrl',
            controllerAs: 'vmAddCoupons',
            // resolve: couponCtrl.resolve
        }
    });
})();