var configAddCtrl = (function () {
    'use strict';

    angular
        .module('bzConfig')
        .controller('configAddCtrl', configAddCtrl);

    function configAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, configSvc, bzUtilsSvc) {
        /* jshint validthis: true */
        var vmAddConfigs = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('config', ['add'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddConfigs.formData = {
            name: '',
            value: 0,
            description: '',
            status: true,
            type: ""
        };
        vmAddConfigs.lockFOrm = false;
        vmAddConfigs.save = create;
        vmAddConfigs.submitted = false;

        //Init

        function create(isValid) {
            vmAddConfigs.submitted = true;
            vmAddConfigs.lockForm = true;
            if (isValid) {
                configSvc.create(vmAddConfigs.formData).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Đơn vị',
                            message: 'Thêm thành công'
                        }
                    });
                    $state.go('configs');
                }).catch(function (error) {
                    // console.log('error', error);
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Config',
                            message: error.data
                        }
                    });
                });
            }
            else {
                vmAddConfigs.submitted = true;
            }
        };

        // Custom Name Config
        function generatorName(text) {
            vmAddConfigs.formData.name = bzUtilsSvc.textToSlug(text);
            if (vmAddConfigs.formData.name != text)
                vmAddConfigs.showTip = true;
            else
                vmAddConfigs.showTip = false;
        }
    }


    var resolve = {
        /* @ngInject */
        preload: function (bzPreloadSvc) {
            return bzPreloadSvc.load([]);
        }
    };

    return {
        resolve: resolve
    };
})();