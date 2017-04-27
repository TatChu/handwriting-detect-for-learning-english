; (function () {
    'use strict';

    Application.registerRouter({
        state: 'tag-create',
        config: {
            url: '/tag-create',
            data: {
                title: 'Tag',
                menuType: 'tag'
            },
            templateUrl: 'modules/admin-tag/view/client/create-tag/view.html',
            controller: 'tagAddCtrl',
            controllerAs: 'vmAddTags',
            // resolve: tagCtrl.resolve
        }
    });
})();