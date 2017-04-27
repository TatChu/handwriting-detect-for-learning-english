; (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('shippingAddressCtrl', shippingAddressCtrl);

	function shippingAddressCtrl($scope, $rootScope, $state, $window, $bzPopup, $uibModal, bzResourceSvc, userSvc, authSvc, editableOptions) {
		var vmShippingAddress = this;

		vmShippingAddress.menuActive = "shipping-address";
		//Vars
		vmShippingAddress.formData = {};
		vmShippingAddress.submitted = false;
		vmShippingAddress.lockForm = false;
		vmShippingAddress.user = $window.data.user;
		vmShippingAddress.user.roles = $window.user.scope;
		
		// Methods
		vmShippingAddress.deleteUserShipping = deleteUserShipping;
		vmShippingAddress.popAddShippingAddress = popAddShippingAddress;
		vmShippingAddress.popEditShippingAddress = popEditShippingAddress;
		//Init

		angular.element('#mod-user-shippingaddress #hide1').removeClass('hidden');
		function init() {
			var id =  $window.user.uid;
			bzResourceSvc.api($window.settings.services.apiUrl + '/user/profile', { id: '@id' })
			.get({}, function (resp) {
				vmShippingAddress.user = resp;
				vmShippingAddress.user.roles = $window.user.scope;
			});
		}

		function deleteUserShipping(id_shipping_address) {
			var user = vmShippingAddress.user;
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: settings.services.webUrl +  '/assets/global/message-web/view.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.popTitle = 'Xóa';
                    $scope.message = 'Bạn chắc chắn sẽ xóa địa chỉ này?';
                    $scope.ok = function () {
                        delete user.deletedAt;
                        delete user.__v;
                        delete user.password_token;
                        delete user.created;
                        delete user.provider;
                        delete user.activeToken;
						delete user.favorite_product;
						delete user.dob;
						delete user.password;
						delete user.vocative;
                        
                        // Tìm vị trí và xóa địa chỉ giao hàng trong user
                        var p = user.customer.shipping_address.find(function (x) {
                            return x._id == id_shipping_address;
                        });
                        var i = user.customer.shipping_address.indexOf(p);
                        user.customer.shipping_address.splice(i, 1);

                        // Cập nhập lại user
                        authSvc.update(user, user._id).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Địa chỉ',
                                    message: "Xóa thành công"
                                }
                            });
                            $uibModalInstance.close();
                        }).catch(function (err) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Địa chỉ',
                                    message: err.data.message
                                }
                            });
                            $uibModalInstance.close();
                        });

                    };
                }
            });
        }

		

		function popAddShippingAddress() {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: settings.services.webUrl + '/modules/web-user/view/client/popup/add-shipping-address/view.html',
				controller: 'popAddShippingAddressCtrl',
				controllerAs: 'vmAddShippingAddress',
			});
			modalInstance.result.then(function (resp) {
				init();
			});
		}

		function popEditShippingAddress(shipping_address) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: settings.services.webUrl + '/modules/web-user/view/client/popup/edit-shipping-address/view.html',
				controller: 'popEditShippingAddressCtrl',
				controllerAs: 'vmEditShippingAddress',
				resolve: {
					data: function () {
						return angular.copy({
							shipping_address: shipping_address
						});
					},
				}
			});
			modalInstance.result.then(function (resp) {
				init();
			});
		}

		//End func
	}
})();