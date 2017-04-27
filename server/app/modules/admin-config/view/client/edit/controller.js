var configEditCtrl = (function () {
    'use strict';

    angular
        .module('bzConfig')
        .controller('configEditCtrl', configEditCtrl);

    function configEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, configSvc, bzUtilsSvc) {
        /* jshint validthis: true */
        var vmEditConfig = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('config', ['edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditConfig.lockFOrm = false;
        vmEditConfig.save = update;
        vmEditConfig.vmEditConfig = getConfig;
        vmEditConfig.submitted = false;

        //Init
        getConfig();

        function getConfig() {
            const id = $stateParams.id;
            configSvc.get(id).then(function (res) {
                vmEditConfig.formData = res;
                if (!vmEditConfig.formData.type)
                    vmEditConfig.formData.type = "";
                // console.log(res);
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Getting',
                        message: err.data
                    }
                });
            });
        };

        function update(isValid) {
            vmEditConfig.submitted = true;
            vmEditConfig.lockForm = true;
            if (isValid) {
                configSvc.update(vmEditConfig.formData, vmEditConfig.formData._id).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Config',
                            message: 'Cập nhật thành công'
                        }
                    });
                    $state.go('configs');
                }).catch(function (error) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Cập nhật config',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmEditConfig.submitted = true;
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