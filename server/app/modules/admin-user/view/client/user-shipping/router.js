; (function () {
    'use strict';

    Application.registerRouter({
        state: 'user-shipping',
        config: {
            url: '/user-shipping/{id}',
            data: {
                title: 'UserShipping',
                menuType: 'user-shipping'
            },
            templateUrl: 'modules/admin-user/view/client/user-shipping/view.html',
            controller: 'userShippingCtrl',
            controllerAs: 'vmUserShipping',
            resolve: userShippingCtrl.resolve
        }
    });
})();