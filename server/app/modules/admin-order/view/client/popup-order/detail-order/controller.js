var popupOrderCtrl = (function () {
    'use strict';

    angular
        .module('bzOrder')
        .controller('popupOrderCtrl', popupOrderCtrl);

    function popupOrderCtrl($scope, $rootScope, $window, $state, $stateParams, $bzPopup, $uibModal, $uibModalInstance,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, orderSvc, order, statusOrderList, shipperList, permission, productSvc, shippingfeeSvc) {
        /* jshint validthis: true */

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('order', ['add', 'edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Methods
        $scope.updateOrderDetail = updateOrderDetail;
        $scope.checkImgOld = productSvc.checkImgOld;
        $scope.onChangeDeliveryType = onChangeDeliveryType;
        // Vars
        $scope.statusOrder = statusOrderList;
        $scope.shipperList = shipperList;
        $scope.urlImg = settingJs.configs.uploadDirectory.thumb_product;

        // Init
        $scope.orderDetail = order;
        $scope.isFirstOder = false;
        checkFirstOrder();

        // Function
        function updateOrderDetail(form) {

            // Caculating total pay
            $scope.orderDetail.total_pay = ($scope.orderDetail.total + $scope.orderDetail.payment_info.info.shipping_fee)
                - $scope.orderDetail.coupon.value
                - (($scope.orderDetail.delivery_time == 'CHIEU') ?
                    ($rootScope.promotionForOrderDeleveryOnAffternoon.type
                        == "PC" ?
                        (($rootScope.promotionForOrderDeleveryOnAffternoon.value / 100) * $scope.orderDetail.total)
                        : $rootScope.promotionForOrderDeleveryOnAffternoon.value)
                    : 0)
                - ($scope.isFirstOder ?
                    ($rootScope.promotionForFirstOrder.type == "MN" ?
                        $rootScope.promotionForFirstOrder.value
                        : (($rootScope.promotionForFirstOrder.value / 100) * $scope.orderDetail.total))
                    : 0);

            orderSvc.update({
                order: $scope.orderDetail
            }, $scope.orderDetail._id).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Thành công!',
                        message: 'Cập nhật đơn hàng thành công!'
                    }
                });
                $uibModalInstance.close($scope.orderDetail);
            }).catch(function (err) {
                form.$submitted = false;
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Lỗi!',
                        message: resp.err.message
                    }
                });
            })
        }

        function onChangeDeliveryType() {
            if ($scope.orderDetail.delivery_type == 'CT') {
                $scope.orderDetail.payment_info.info.shipping_fee = 0;
            } else {
                $scope.orderDetail.payment_info.info.shipping_fee = order.shipping_fee.fee;
            }
        }

        function checkFirstOrder() {
            if ($scope.orderDetail.payment_info.info.user_id) {
                bzResourceSvc.api($window.settings.services.admin + '/order/' + $scope.orderDetail.payment_info.info.user_id._id + '-' + $scope.orderDetail._id)
                    .get({}, function (resp) {
                        if (!$scope.orderDetail.old_id && resp.success)
                            $scope.isFirstOder = resp.success;
                    }), function (err) {
                        console.log('checkFirstOrder', err);
                    };
            }
        }

        $scope.editUserShipping = function editUserShipping() {
            $state.go('user-shipping', { id: $scope.orderDetail.payment_info.info.user_id._id });
            $uibModalInstance.close($scope.orderDetail.payment_info.info.id_shipping_address);
        }
    }
})();