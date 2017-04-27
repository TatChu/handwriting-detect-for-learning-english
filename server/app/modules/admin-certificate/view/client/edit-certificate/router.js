; (function () {
    'use strict';

    Application.registerRouter({
        state: 'certificate-edit',
        config: {
            url: '/certificate-edit/{id}',
            data: {
                title: 'Certificate',
                menuType: 'certificate'
            },
            templateUrl: 'modules/admin-certificate/view/client/edit-certificate/view.html',
            controller: 'certificateEditCtrl',
            controllerAs: 'vmEditCertificates',
            // resolve: certificateCtrl.resolve
        }
    });
})();