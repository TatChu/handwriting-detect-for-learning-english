var userShippingCtrl = (function () {
    'use strict';

    angular
        .module('bzUser')
        .controller('userShippingCtrl', userShippingCtrl);

    function userShippingCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, userSvc, editableOptions) {
        /* jshint validthis: true */
        var vmUserShipping = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin())) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmUserShipping.lockFOrm = false;
        vmUserShipping.submitted = false;
        vmUserShipping.userId = $stateParams.id;
        vmUserShipping.showForm = false;

        //Methods
        vmUserShipping.addUserShipping = addUserShipping;
        vmUserShipping.deleteUserShipping = deleteUserShipping;
        vmUserShipping.show = show;
        vmUserShipping.updateAddressShipping = updateAddressShipping;
        vmUserShipping.checkEmpty = checkEmpty;

        //Init
        getDistrict();
        getUser();

        function getDistrict() {
            bzResourceSvc.api($window.settings.services.admin + '/all-shippingfee')
                .get(function (resp) {
                    vmUserShipping.districts = resp.items;
                });
        };

        function getUser() {
            bzResourceSvc.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
                .get({ id: vmUserShipping.userId }, function (resp) {
                    vmUserShipping.user = resp;
                });
        }

        function updateAddressShipping(address) {
            // console.log(vmUserShipping.user);
            delete vmUserShipping.user.__v;
            delete vmUserShipping.user.password_token;
            delete vmUserShipping.user.created;
            delete vmUserShipping.user.provider;
            delete vmUserShipping.user.activeToken;

            vmUserShipping.user.cfpassword = vmUserShipping.user.password;
            if (!vmUserShipping.user.dob)
                vmUserShipping.user.dob = '';
            userSvc.update(vmUserShipping.user, vmUserShipping.userId).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Địa chỉ giao hàng',
                        message: "Cập nhật thành công"
                    }
                });
                $state.reload();
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Địa chỉ giao hàng',
                        message: err.data.message
                    }
                });
                userEdit.lockForm = false;
            });
        }

        function checkEmpty(data) {
            if (data == '' || data == null)
                return "Dữ liệu không được để trống";
        }

        function addUserShipping(isValid) {
            if (!vmUserShipping.user.dob)
                vmUserShipping.user.dob = '';
            vmUserShipping.submitted = true;
            vmUserShipping.lockForm = true;
            if (isValid) {
                var shipping_address = {
                    name: vmUserShipping.formData.txtName,
                    phone: vmUserShipping.formData.phone,
                    address_detail: vmUserShipping.formData.address,
                    id_shipping_fee: vmUserShipping.formData.district
                };

                bzResourceSvc.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
                    .get({ id: vmUserShipping.userId }, function (resp) {
                        delete resp.__v;
                        delete resp.password_token;
                        delete resp.created;
                        delete resp.provider;
                        delete resp.activeToken;

                        var user = resp;
                        if (!user.dob)
                            user.dob = '';
                        user.cfpassword = user.password;
                        user.customer.shipping_address.push(shipping_address);


                        // Cập nhập lại user
                        userSvc.update(user, vmUserShipping.userId).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Địa chỉ',
                                    message: "Thêm thành công"
                                }
                            });
                            $state.reload();
                        }).catch(function (err) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Địa chỉ',
                                    message: err.data.message
                                }
                            });
                            userEdit.lockForm = false;
                        });

                    });
            }


        };


        function deleteUserShipping(id_shipping_address) {
            if (!vmUserShipping.user.dob)
                vmUserShipping.user.dob = '';
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'assets/global/message/view.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.popTitle = 'Xóa';
                    $scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
                    $scope.ok = function () {

                        var user = vmUserShipping.user;

                        delete user.__v;
                        delete user.password_token;
                        delete user.created;
                        delete user.provider;
                        delete user.activeToken;
                        user.cfpassword = user.password;


                        // Tìm vị trí và xóa địa chỉ giao hàng trong user
                        var p = user.customer.shipping_address.find(function (x) {
                            return x._id == id_shipping_address;
                        });
                        var i = user.customer.shipping_address.indexOf(p);
                        user.customer.shipping_address.splice(i, 1);

                        // Cập nhập lại user
                        userSvc.update(user, vmUserShipping.userId).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Địa chỉ',
                                    message: "Xóa thành công"
                                }
                            });
                            $uibModalInstance.close();
                            $state.reload();
                        }).catch(function (err) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Địa chỉ',
                                    message: err.data.message
                                }
                            });
                            userEdit.lockForm = false;
                            $uibModalInstance.close();
                        });

                    };
                }
            });
        }

        function show() {
            vmUserShipping.showForm = !vmUserShipping.showForm;
        }

        //End function ctrl
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