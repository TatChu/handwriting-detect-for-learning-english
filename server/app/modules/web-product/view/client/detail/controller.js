var productDetail = (function () {
	'use strict';

	angular
		.module('bzProduct')
		.controller('productDetailCtrl', productDetailCtrl);

	function productDetailCtrl($scope, $rootScope, $window, orderApiSvc, userSvcApi, apiProductSvc, authSvc) {
		// Vars
		var vmProDe = $scope;
		vmProDe.data = $window.data;
		vmProDe.credentials = $window.credentials;
		vmProDe.allowAddCart = true;
		vmProDe.monthPro = [];
		vmProDe.relativePro = [];
		vmProDe.showDetailContent = false;

		// Methods
		vmProDe.popProDetail = apiProductSvc.popupDetailPro;
		vmProDe.addToCartGA = apiProductSvc.addToCartGA;
		vmProDe.addToCart = addToCart;
		vmProDe.decreaseCart = decreaseCart;
		vmProDe.findPro = findPro;
		vmProDe.addFavoriteProduct = addFavoriteProduct;
		vmProDe.removeFavoriteProduct = removeFavoriteProduct;
		vmProDe.checkDueDate = checkDueDate;
		vmProDe.login = login;
		vmProDe.showDetail = showDetail;

		vmProDe.$on('Cart:getCart', getCart);

		angular.element('.share-section').removeClass('hidden');
		init();

		/*FUNCTION*/
		function init() {
			vmProDe.detail_infor = $('#text-detail')[0].innerHTML;
			setTimeout(function () {
				angular.element('#mod-detail .col-xs-11.col-left .row').removeAttr("style");
				angular.element('#mod-detail .col-xs-11.col-left .row.text-center').addClass('hidden');

				// Eff show more detail product
				var height_detail = angular.element('#mod-detail #text-detail').height();
				if (height_detail > 350) {
					vmProDe.showDetailContent = true;
					vmProDe.detailContent = 'hideContent';
					vmProDe.detailContentStyle = {
						'overflow': 'hidden',
						'max-height': '350px'
					};
				}
			}, 100);
		}

		function addToCart(id) {
			if (vmProDe.allowAddCart) {
				vmProDe.allowAddCart = false;
				apiProductSvc.addToCart(id, function (resp) {
					getCart();
				})
			}
		}

		function decreaseCart(id, quantity) {
			apiProductSvc.decreaseCart(id, quantity, function (resp) {
				getCart();
			})
		}

		function getCart() {
			if ($rootScope.Cart.items) {
				try {
					vmProDe.data.product.cart = $rootScope.Cart.items.find(function (item) {
						return vmProDe.data.product._id == item.id_product;
					});
					if (vmProDe.monthPro) {
						vmProDe.monthPro = vmProDe.monthPro.map(function (item) {
							return {
								id_product: item.id_product,
								cart: $rootScope.Cart.items.find(function (cart) {
									return item.id_product == cart.id_product;
								})
							}
						});
					}

					if (vmProDe.relativePro) {
						vmProDe.relativePro = vmProDe.relativePro.map(function (item) {
							return {
								id_product: item.id_product,
								cart: $rootScope.Cart.items.find(function (cart) {
									return item.id_product == cart.id_product;
								})
							}
						});
					}
				} catch (error) {
					vmProDe.data.product.cart = apiProductSvc.findByIdProduct($rootScope.Cart.items, vmProDe.data.product._id);

					if (vmProDe.monthPro) {
						var tmp_monthPro = [];
						for (var index = 0; index < vmProDe.monthPro.length; index++) {
							var element = vmProDe.monthPro[index];
							if (element) {
								vmProDe.monthPro[index] = findPro(element.id_product);
							}
						}
					}

					if (vmProDe.relativePro) {
						var tmp_monthPro = [];
						for (var index = 0; index < vmProDe.relativePro.length; index++) {
							var element = vmProDe.relativePro[index];
							if (element) {
								vmProDe.relativePro[index] = findPro(element.id_product);
							}
						}
					}
				}
			}
			angular.element('.button').removeClass('hidden');
			vmProDe.allowAddCart = true;
		}

		function findPro(id) {
			var cart;
			try {
				cart = $rootScope.Cart.items.find(function (item) {
					return item.id_product == id;
				});
			} catch (error) {
				cart = apiProductSvc.findByIdProduct($rootScope.Cart.items, id);
			}
			return {
				id_product: id,
				cart: cart
			}
		}

		function addFavoriteProduct() {
			vmProDe.data.user.favorite_product.push(vmProDe.data.product._id);
			userSvcApi.updateFavoriteProduct(vmProDe.data.user, vmProDe.data.user._id).then(function (resp) {
			}).catch(function (err) {
				console.log(err);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi',
						message: 'Có lỗi. Hãy thử lại'
					}
				});
				var index = vmProDe.data.user.favorite_product.indexOf(vmProDe.data.product._id);
				if (index != -1) {
					vmProDe.data.user.favorite_product.splice(index, 1);
				}
			})
		}

		function removeFavoriteProduct() {
			var index = vmProDe.data.user.favorite_product.indexOf(vmProDe.data.product._id);
			vmProDe.data.user.favorite_product.splice(index, 1);
			userSvcApi.updateFavoriteProduct(vmProDe.data.user, vmProDe.data.user._id).then(function (resp) {
			}).catch(function (err) {
				console.log(err);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi',
						message: 'Có lỗi. Hãy thử lại'
					}
				});
				vmProDe.data.user.favorite_product.push(vmProDe.data.product._id);
				if (index != -1) {
					vmProDe.data.user.favorite_product.splice(index, 1);
				}
			})
		}

		function checkDueDate(end_date) {
			if (end_date) {
				end_date = moment(end_date);
				return moment().isBefore(end_date)
			}
			else {
				return true;
			}
		}

		function showDetail() {
			if (vmProDe.detailContent == 'hideContent') {
				vmProDe.detailContent = 'showContent';
				vmProDe.detailContentStyle = {
					'max-height': 'auto',
				};
			}
			else {
				$('#text-detail').html(vmProDe.detail_infor);
				vmProDe.detailContent = 'hideContent';
				vmProDe.detailContentStyle = {
					'overflow': 'hidden',
					'max-height': '350px'
				};
			}
		}

		function login() {
			authSvc.popLogin();
		}
	}
})();
