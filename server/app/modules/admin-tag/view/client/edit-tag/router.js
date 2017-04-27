; (function () {
    'use strict';

    Application.registerRouter({
        state: 'tag-edit',
        config: {
            url: '/tag-edit/{id}',
            data: {
                title: 'Tag',
                menuType: 'tag'
            },
            templateUrl: 'modules/admin-tag/view/client/edit-tag/view.html',
            controller: 'tagEditCtrl',
            controllerAs: 'vmEditTags',
            // resolve: tagCtrl.resolve
        }
    });
})();