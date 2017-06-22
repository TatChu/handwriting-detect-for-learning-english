var updateRecognitonDataCtrl = (function () {
    'use strict';

    angular
        .module('bsRecognition')
        .controller('updateRecognitonDataCtrl', updateRecognitonDataCtrl);

    function updateRecognitonDataCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, recognitionSrv, Upload) {
        /* jshint validthis: true */
        var vmURD = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('unit', ['add'])))) {
            $state.go('error403');
        }
        vmURD.upload = upload;
        vmURD.formData = {
            data: ''
        }
        function upload() {


            if (vmURD.formData.data != '') {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'assets/global/message/view.html',
                    controller: function ($scope, $uibModalInstance) {
                        $scope.popTitle = 'Cập nhật dữ liệu nhận dạng';
                        $scope.message = 'Bạn chắc chắn sẽ sử dụng dữ liệu này cho hệ thống?';
                        $scope.ok = function () {
                            recognitionSrv.updateJson(vmURD.formData).then(function (res) {
                                $bzPopup.toastr({
                                    type: 'success',
                                    data: {
                                        title: 'Thành công',
                                        message: 'Đã cập nhật dữ liệu nhận dạng'
                                    }
                                });
                            }).catch(function (err) {
                                $bzPopup.toastr({
                                    type: 'error',
                                    data: {
                                        title: 'Thất bại',
                                        message: 'Không thể cập nhật. Thử lại sau'
                                    }
                                });
                            })
                        };
                    }
                });
            }
            else {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Thất bại',
                        message: 'Kiểm tra thông tin'
                    }
                });
            }

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