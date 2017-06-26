var popupUpdateNNCtrl = (function () {
    'use strict';

    angular
        .module('bsRecognition')
        .controller('popupUpdateNNCtrl', popupUpdateNNCtrl);

    function popupUpdateNNCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal, $uibModalInstance,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, customResourceSrv, userSvc, user_id, user) {
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/
        // Vars
        $scope.User = user;
        $scope.user_id = user_id;
        $scope.data = $scope.User.neural_network_json;
        $scope.notifyInvalidData = notifyInvalidData;
        $scope.notifyValidData = notifyValidData;
        $scope.updateData = updateData;
        // Methods

        $scope.checkData = function () {
            if ($scope.data != '') {
                $scope.dataTest = JSON.parse($scope.data);
                if ($scope.dataTest) {
                    if ($scope.dataTest.test && $scope.dataTest.test.test_case && $scope.dataTest.test.pass && $scope.dataTest.test.percent_recognition) {
                        if ($scope.dataTest.net.layers.length == 3) {
                            $scope.data_valid = true;
                            notifyValidData()
                        }
                    } else notifyInvalidData();

                } else notifyInvalidData();
            }
            else notifyInvalidData();
        }

        function notifyInvalidData() {
            $scope.data_valid = false;
            $bzPopup.toastr({
                type: 'error',
                data: {
                    title: 'Lỗi',
                    message: 'Dữ liệu không hợp lệ!'
                }
            });
        }

        function notifyValidData() {
            $scope.data_valid = true;
            $bzPopup.toastr({
                type: 'success',
                data: {
                    title: 'Thành công',
                    message: 'Dữ liệu hợp lệ!'
                }
            });
        }

        function updateData() {

            if (!$scope.User.dob) $scope.User.dob = '';
            delete $scope.User.password;
            delete $scope.User.__v;
            delete $scope.User.provider;
            delete $scope.User.activeToken;
            delete $scope.User.cfpassword;

            $scope.User.neural_network_json = $scope.data;
            $scope.User.request_recognition = 'PROCCESSED';
            userSvc.update($scope.User, $scope.user_id).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Cập nhật dữ liệu huấn luyện',
                        message: "Cập nhật thành công"
                    }
                });
                $state.reload();
                setTimeout(function () {
                    $uibModalInstance.close();
                }, 1000);
            }, function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Thất bại',
                        message: err.data.message
                    }
                });
                userEdit.lockForm = false;
            });
        }
    }
})();