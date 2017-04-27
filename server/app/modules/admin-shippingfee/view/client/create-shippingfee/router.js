; (function () {
    'use strict';

    Application.registerRouter({
        state: 'shippingfee-create',
        config: {
            url: '/shippingfee-create',
            data: {
                title: 'ShippingFee',
                menuType: 'shippingfee'
            },
            templateUrl: 'modules/admin-shippingfee/view/client/create-shippingfee/view.html',
            controller: 'shippingfeeAddCtrl',
            controllerAs: 'vmAddShippingFees',
            // resolve: shippingfeeCtrl.resolve
        }
    });
})();