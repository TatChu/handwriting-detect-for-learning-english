; (function () {
    'use strict';

    angular
    .module('bzUser')
    .controller('popEditShippingAddressCtrl', popEditShippingAddressCtrl);

    function popEditShippingAddressCtrl($scope, $rootScope, $state, $window, $bzPopup, $uibModalInstance, bzResourceSvc, authSvc, userSvc, data) {
        var vmEditShippingAddress = this;
        //Vars
        vmEditShippingAddress.formData = {};
        vmEditShippingAddress.submitted = false;
        vmEditShippingAddress.lockForm = false;
        vmEditShippingAddress.user = $window.data.user;
        vmEditShippingAddress.user.roles = $window.user.scope;
        vmEditShippingAddress.formData = data.shipping_address;
        vmEditShippingAddress.updateAddressShipping = updateAddressShipping;
        // Methods
        //Init
        vmEditShippingAddress.districts = $window.data.shippingfee;
        
        
        function updateAddressShipping(isValid) {
            vmEditShippingAddress.submitted = true;
            vmEditShippingAddress.lockForm = true;
            if(isValid) {
                delete vmEditShippingAddress.user.deletedAt;
                delete vmEditShippingAddress.user.__v;
                delete vmEditShippingAddress.user.password_token;
                delete vmEditShippingAddress.user.created;
                delete vmEditShippingAddress.user.provider;
                delete vmEditShippingAddress.user.activeToken;
                delete vmEditShippingAddress.user.favorite_product;
                delete vmEditShippingAddress.user.dob;
                delete vmEditShippingAddress.user.password;
                delete vmEditShippingAddress.user.vocative;
                
                var user = vmEditShippingAddress.user;

                var index = 0;
                var p = user.customer.shipping_address.find(function (item, key) {
                    index = key;
                    return item._id == data.shipping_address._id;
                });
                console.log('test',user.customer.shipping_address[index],vmEditShippingAddress.formData);
                user.customer.shipping_address[index] = {
                    name: sanitizeHtml(vmEditShippingAddress.formData.name),
                    phone: sanitizeHtml(vmEditShippingAddress.formData.phone),
                    address_detail: sanitizeHtml(vmEditShippingAddress.formData.address_detail),
                    id_shipping_fee: vmEditShippingAddress.formData.id_shipping_fee._id
                };
                console.log('test1',user.customer.shipping_address[index]);
                if(user.customer.shipping_address[index].name == '' 
                    || user.customer.shipping_address[index].phone == '' 
                    || user.customer.shipping_address[index].address_detail == '' )
                {
                    $bzPopup.toastr({
                        type: 'error',
                        data:{
                            title: 'Lỗi',
                            message: "Dữ liệu nhập vào bị lỗi !!"
                        }
                    });
                    vmEditShippingAddress.lockForm = false;
                    return;
                }

                authSvc.update(user, user._id).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Địa chỉ giao hàng',
                            message: "Cập nhật thành công"
                        }
                    });
                    vmEditShippingAddress.lockForm = false;
                    $uibModalInstance.close(resp);
                }).catch(function (err) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Địa chỉ giao hàng',
                            message: err.data.message
                        }
                    });
                    vmEditShippingAddress.lockForm = false;
                });
            }
            else {
                vmEditShippingAddress.submitted = true;
                vmEditShippingAddress.lockForm = false;
            }

        }


        //End func
    }
})();