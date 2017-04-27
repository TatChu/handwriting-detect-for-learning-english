; (function () {
    'use strict';

    Application.registerRouter({
        state: 'certificate-create',
        config: {
            url: '/certificate-create',
            data: {
                title: 'Certificate',
                menuType: 'certificate'
            },
            templateUrl: 'modules/admin-certificate/view/client/create-certificate/view.html',
            controller: 'certificateAddCtrl',
            controllerAs: 'vmAddCertificates',
            // resolve: certificateCtrl.resolve
        }
    });
})();