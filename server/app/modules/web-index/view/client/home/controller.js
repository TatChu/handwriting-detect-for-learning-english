var homeCtrl = (function () {
	'use strict';

	angular
		.module('bzWebHome')
		.controller('homeCtrl', homeCtrl);

	function homeCtrl($scope, $window, $uibModal, $rootScope, orderApiSvc, apiProductSvc) {
		// Vars
		var vmHome = $scope;
		vmHome.data = $window.data;
		vmHome.allowAddCart = true;
		vmHome.cart_category = [];
		vmHome.cart_tag = [];
		vmHome.categories_list = $window.category_menu.categories_list;

		// Method
		vmHome.addToCart = addToCart;
		vmHome.findPro = findPro;
		vmHome.decreaseCart = decreaseCart;
		vmHome.popDetPro = apiProductSvc.popupDetailPro;
		vmHome.addToCartGA = apiProductSvc.addToCartGA;
		vmHome.$on('Cart:getCart', getCart);
		angular.element('.take-cart').removeClass('hidden');
		// angular.element('#banner-top').removeClass('hidden');
		angular.element('.choose-bottom').removeClass('hidden');

		// Functions
		function addToCart(id) {
			if (vmHome.allowAddCart) {
				vmHome.allowAddCart = false;
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

		function getCart(event, data) {
			if ($rootScope.Cart) {
				try {
					vmHome.cart_category = vmHome.cart_category.map(function (item, key) {
						var tmp_arr = $.map(item, function (value, i) {
							return [value];
						}).map(function (item) {
							return {
								id_product: item.id_product,
								cart: $rootScope.Cart.items.find(function (cart) {
									return item.id_product == cart.id_product;
								})
							}
						})
						return tmp_arr;
					})
				} catch (error) {
					var tmp_cart_arr = vmHome.cart_category;
					for (var i = 0; i < tmp_cart_arr.length; i++) {
						var element = tmp_cart_arr[i];
						var tmp_arr = $.map(element, function (value, i) {
							return [value];
						});
						for (var j = 0; j < tmp_arr.length; j++) {
							tmp_cart_arr[i][j] = findPro(tmp_arr[j].id_product);
						}
					}
					vmHome.cart_category = tmp_cart_arr;
				}

				vmHome.cartDone = true;
				vmHome.allowAddCart = true;
			}
		}
	}
})();
