; (function () {
    'use strict';

    Application.registerRouter({
        state: 'vocabularys',
        config: {
            url: '/vocabularys?page&limit&id&keyword&class',
            data: {
                title: 'Vocabulary',
                menuType: 'vocabulary'
            },
            params: {
                page: '1',
                sort: '-createdAt',
                limit: '15'
            },
            templateUrl: 'modules/admin-vocabulary/view/client/list/list-vocabulary.html',
            controller: 'vocabularysCtrl',
            controllerAs: 'vmVocabularys',
            // resolve: vocabularysCtrl.resolve
        }
    });
})();
