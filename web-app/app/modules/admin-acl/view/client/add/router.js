; (function () {
    'use strict';

    Application.registerRouter({
        state: 'add-permission',
        config: {
            url: '/permission/add',
            data: {
                title: 'Add permission',
                menuType: 'permission'
            },
            params: {
            },
            templateUrl: 'modules/admin-acl/view/client/add/view.html',
            controller: 'permissionAddCtrl',
            controllerAs: 'vmAddPermission',
            resolve: permissionAddCtrl.resolve
        }
    });
})();
