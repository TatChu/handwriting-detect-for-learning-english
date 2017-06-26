; (function () {
    'use strict';

    Application.registerRouter({
        state: 'proccess-request-recognition',
        config: {
            url: '/recognition/list-request-recog?page&limit&sort&role&id&keyword&status&request_recognition',
            data: {
                title: 'recognition',
                menuType: 'recognition'
            },
            params:{
                request_recognition: 'PENDING'
            },
            templateUrl: 'modules/admin-recognition/view/client/list-request-recog/view.html',
            controller: 'requestRecognitonDataCtrl',
            controllerAs: 'vmURD',
            resolve: requestRecognitonDataCtrl.resolve
        }
    });
})();

