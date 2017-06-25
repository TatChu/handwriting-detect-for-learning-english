; (function () {
    'use strict';

    Application.registerRouter({
        state: 'proccess-request-recognition',
        config: {
            url: '/recognition/proccess-request-recognition?page&limit&sort&role&id&keyword&status&request_recognition',
            data: {
                title: 'recognition',
                menuType: 'recognition'
            },
            params:{
                request_recognition: 'PENDING'
            },
            templateUrl: 'modules/admin-recognition/view/client/proccess-request-recognition/view.html',
            controller: 'requestRecognitonDataCtrl',
            controllerAs: 'vmURD',
            resolve: requestRecognitonDataCtrl.resolve
        }
    });
})();

