var permissionListCtrl = (function () {
    'use strict';

    angular
        .module('bzPermission')
        .controller('permissionListCtrl', permissionListCtrl);

    function permissionListCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, authSvc, permissionSvc, listAction, listResource) {
        var vmPermission = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin())) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Init
        getData();

        // Vars
        // vmPermission.loading = true;
        vmPermission.listAction = listAction;
        vmPermission.listResource = listResource;
        vmPermission.getData = getData;
        vmPermission.data = [];
        vmPermission.removeRole = removeRole;
        vmPermission.removeResource = removeResource;
        
        // Methods
        function getData() {
            permissionSvc.get().then(function (resp) {
                if (resp.success)
                    vmPermission.data = resp.data;
            }).catch(function (err) {
                console.log(err);
            });
        }

        function removeResource(role, resource) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'assets/global/message/view.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.popTitle = 'Xóa';
                    $scope.message = 'Bạn muốn xóa quyền ' + role + ' trên ' + resource + '?';
                    $scope.ok = function () {
                        permissionSvc.removeResource(role, resource).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Permission',
                                    message: 'Deleted ' + resource + '\'s ' + role + '!'
                                }
                            });
                            $state.reload();
                            $uibModalInstance.close();

                        }).catch(function (err) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Permission',
                                    message: err.message
                                }
                            });
                        });
                    };
                }
            });
        }
        function removeRole(role) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'assets/global/message/view.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.popTitle = 'Xóa';
                    $scope.message = 'Bạn muốn xóa ' + role + '?';
                    $scope.ok = function () {
                        permissionSvc.removeRole(role).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Permission',
                                    message: 'Deleted ' + role + '!'
                                }
                            });
                            $state.reload();
                            $uibModalInstance.close();

                        }).catch(function (err) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Permission',
                                    message: err.message
                                }
                            });
                        });

                    };
                }
            });
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