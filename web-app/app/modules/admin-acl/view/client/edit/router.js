; (function () {
    'use strict';

    Application.registerRouter({
        state: 'editPermission',
        config: {
            url: '/permission/edit/{mod}/{role}/{resource}',
            data: {
                title: 'Edit Permission',
                menuType: 'permission'
            },
            params: {
            },
            templateUrl: 'modules/admin-acl/view/client/edit/view.html',
            controller: 'permissionEditCtrl',
            controllerAs: 'vmEditPermission',
            resolve: permissionListCtrl.resolve
        }
    });
})();
