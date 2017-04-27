var permissionEditCtrl = (function () {
    'use strict';

    angular
        .module('bzPermission')
        .controller('permissionEditCtrl', permissionEditCtrl);

    function permissionEditCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, authSvc, permissionSvc, listAction, listResource, bzUtilsSvc) {
        var vmEditPermission = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin())) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditPermission.type = $stateParams.type;
        vmEditPermission.resource = $stateParams.resource;
        vmEditPermission.modEdit = $stateParams.mod;
        vmEditPermission.formData = {
            role: $stateParams.role,
            resource: []
        };


        // vmEditPermission.listRole = listRole;
        vmEditPermission.save = update;
        vmEditPermission.checkName = checkName;

        vmEditPermission.onChangePermission = onChangePermission;
        vmEditPermission.getResource = getResource;

        // Init
        // Methods
        function getResource() {
            permissionSvc.getResoureRole($stateParams.role).then(function (resp) {
                if (vmEditPermission.modEdit == 'add-resource') {
                    resp.data.forEach(function (val, index) {
                        // Xoá các resource role đã có hiện tại
                        if (listResource.indexOf(val.resource) != -1) {
                            listResource.splice(listResource.indexOf(val.resource), 1);
                        }
                    });
                }
                else {
                    vmEditPermission.formData.resource = [vmEditPermission.resource];
                    resp.data.forEach(function (val, index) {
                        if (val.resource == vmEditPermission.resource)
                            vmEditPermission.formData.permission = val.permissions;
                    });
                    if (vmEditPermission.formData.permission.indexOf('*') != -1)
                        vmEditPermission.fullPermission = true;
                }
                vmEditPermission.listPermission = listAction;
                vmEditPermission.listResource = listResource;
            }).catch(function (err) {

            })
        }
        function onChangePermission() {
            if (vmEditPermission.fullPermission) {
                vmEditPermission.formData.permission = Array.of('*');
            }
        }
        // Generator name like slug
        function checkName() {
            vmEditPermission.formData.role = bzUtilsSvc.textToSlug(vmEditPermission.formData.role);
        }

        function update(isValid) {
            vmEditPermission.submitted = true;
            vmEditPermission.lockForm = true;
            if (isValid) {
                if (vmEditPermission.formData.permission.indexOf('*') !== -1)
                    vmEditPermission.formData.permission = '*';

                if (vmEditPermission.modEdit == 'add-resource') {
                    permissionSvc.addResource(vmEditPermission.formData, vmEditPermission.formData.role).then(function (resp) {
                        // console.log('update', resp);
                        $bzPopup.toastr({
                            type: 'success',
                            data: {
                                title: 'Phân quyền',
                                message: resp.message
                            }
                        });
                        $state.go('permission');
                    }).catch(function (error) {
                        // console.log('update', error);

                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Phân quyền',
                                message: error.data.message
                            }
                        });
                    });
                }
                if (vmEditPermission.modEdit == 'edit-permission') {
                    permissionSvc.update(vmEditPermission.formData, vmEditPermission.formData.role, vmEditPermission.formData.resource).then(function (resp) {
                        // console.log('update', resp);
                        $bzPopup.toastr({
                            type: 'success',
                            data: {
                                title: 'Phân quyền',
                                message: resp.message
                            }
                        });
                        $state.go('permission');
                    }).catch(function (error) {
                        // console.log('update', error);

                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Phân quyền',
                                message: error.data.message
                            }
                        });
                    });
                }
            }
            else {
                vmEditPermission.submitted = true;
            }
        };
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