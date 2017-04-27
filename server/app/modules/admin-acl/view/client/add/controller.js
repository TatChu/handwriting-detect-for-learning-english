var permissionAddCtrl = (function () {
    'use strict';

    angular
        .module('bzPermission')
        .controller('permissionAddCtrl', permissionAddCtrl);

    function permissionAddCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, authSvc, permissionSvc, listAction, listResource, bzUtilsSvc) {
        var vmAddPermission = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin())) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddPermission.formData = {
            role: '',
            resource: [],
            permission: []
        };
        vmAddPermission.fullPermission = false;

        vmAddPermission.listPermission = listAction;
        vmAddPermission.listResource = listResource;
        // vmAddPermission.listRole = listRole;
        vmAddPermission.save = create;
        vmAddPermission.checkName = checkName;
        vmAddPermission.onChangePermission = onChangePermission;

        // Methods

        function onChangePermission() {
            if (vmAddPermission.fullPermission) {
                vmAddPermission.formData.permission = Array.of('*');
            }
        }
        // Generator name like slug
        function checkName() {
            vmAddPermission.formData.role = bzUtilsSvc.textToSlug(vmAddPermission.formData.role);
        }

        function isExitsRole(roleName, callback) {
            let isExit = false;
            permissionSvc.get().then(function (resp) {
                if (resp.success)
                    resp.data.forEach(function (val, index) {
                        if (val.role == roleName)
                            isExit = true;
                    })
                callback(isExit);
            }).catch(function (err) {
                callback(isExit);
            });
        }

        function create(isValid) {
            vmAddPermission.submitted = true;
            vmAddPermission.lockForm = true;
            if (isValid) {
                if (vmAddPermission.formData.permission.indexOf('*') !== -1)
                    vmAddPermission.formData.permission = ['*'];
                isExitsRole(vmAddPermission.formData.role, function (isExits) {
                    if (isExits) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Phân quyền',
                                message: 'Tên quyền đã tồn tại!'
                            }
                        });
                    }
                    else {
                        permissionSvc.create(vmAddPermission.formData).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Phân quyền',
                                    message: resp.message
                                }
                            });
                            $state.go('permission');
                        }).catch(function (error) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Phân quyền',
                                    message: error.message
                                }
                            });
                        });
                    }

                })
            }
            else {
                vmAddPermission.submitted = true;
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