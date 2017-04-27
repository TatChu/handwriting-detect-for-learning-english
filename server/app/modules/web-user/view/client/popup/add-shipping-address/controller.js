; (function () {
    'use strict';

    angular
    .module('bzUser')
    .controller('popAddShippingAddressCtrl', popAddShippingAddressCtrl);

    function popAddShippingAddressCtrl($scope, $rootScope, $state, $window, $bzPopup, $uibModalInstance, bzResourceSvc, authSvc, userSvc) {
        var vmAddShippingAddress = this;
        //Vars
        vmAddShippingAddress.formData = {};
        vmAddShippingAddress.submitted = false;
        vmAddShippingAddress.lockForm = false;
        vmAddShippingAddress.user = $window.data.user;
        vmAddShippingAddress.districts = $window.data.shippingfee;
        vmAddShippingAddress.user.roles = $window.user.scope;
        // Methods
        vmAddShippingAddress.addShippingAddress = addShippingAddress;
        //Init


        function addShippingAddress(isValid) {
            vmAddShippingAddress.submitted = true;
            vmAddShippingAddress.lockForm = true;
            if (isValid) {
                var shipping_address = {
                    name: sanitizeHtml(vmAddShippingAddress.formData.name),
                    phone: sanitizeHtml(vmAddShippingAddress.formData.phone),
                    address_detail: sanitizeHtml(vmAddShippingAddress.formData.address),
                    id_shipping_fee: vmAddShippingAddress.formData.district
                };
                if(shipping_address.name == '' 
                    || shipping_address.phone == '' 
                    || shipping_address.address_detail == '' )
                {
                    $bzPopup.toastr({
                        type: 'error',
                        data:{
                            title: 'Lỗi',
                            message: "Dữ liệu nhập vào bị lỗi !!"
                        }
                    });
                    vmAddShippingAddress.lockForm = false;
                    return;
                }

                var user = vmAddShippingAddress.user;

                delete user.__v;
                delete user.vocative;
                delete user.password_token;
                delete user.created;
                delete user.provider;
                delete user.activeToken;
                delete user.favorite_product;
                delete user.dob;
                delete user.password;
                user.customer.shipping_address.push(shipping_address);

                // console.log(1,user);
                // Cập nhập lại user
                authSvc.update(user, vmAddShippingAddress.user._id).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Địa chỉ',
                            message: "Thêm thành công"
                        }
                    });
                    vmAddShippingAddress.lockForm = false;
                    $uibModalInstance.close(resp);

                }).catch(function (err) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Thất bại',
                            message: err.data.message
                        }
                    });
                    vmAddShippingAddress.lockForm = false;
                });


            }
            else {
                vmAddShippingAddress.submitted = true;
                vmAddShippingAddress.lockForm = false;
            }


        };


        //End func
    }
})();