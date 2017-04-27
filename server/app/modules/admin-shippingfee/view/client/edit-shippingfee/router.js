; (function () {
    'use strict';

    Application.registerRouter({
        state: 'shippingfee-edit',
        config: {
            url: '/shippingfee-edit/{id}',
            data: {
                title: 'ShippingFee',
                menuType: 'shippingfee'
            },
            templateUrl: 'modules/admin-shippingfee/view/client/edit-shippingfee/view.html',
            controller: 'shippingfeeEditCtrl',
            controllerAs: 'vmEditShippingFees',
            // resolve: shippingfeeCtrl.resolve
        }
    });
})();