; (function () {
    'use strict';

    Application.registerRouter({
        state: 'permission',
        config: {
            url: '/permission',
            data: {
                title: 'Permission',
                menuType: 'permission'
            },
            params: {
            },
            templateUrl: 'modules/admin-acl/view/client/list/view.html',
            controller: 'permissionListCtrl',
            controllerAs: 'vmPermission',
            resolve: permissionListCtrl.resolve
        }
    });
})();
