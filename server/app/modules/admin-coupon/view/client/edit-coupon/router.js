; (function () {
    'use strict';

    Application.registerRouter({
        state: 'coupon-edit',
        config: {
            url: '/coupon-edit/{id}',
            data: {
                title: 'Coupon',
                menuType: 'coupon'
            },
            templateUrl: 'modules/admin-coupon/view/client/edit-coupon/view.html',
            controller: 'couponEditCtrl',
            controllerAs: 'vmEditCoupons',
            // resolve: couponCtrl.resolve
        }
    });
})();