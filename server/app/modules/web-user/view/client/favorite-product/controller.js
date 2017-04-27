; (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('favoriteProductCtrl', favoriteProductCtrl);

	function favoriteProductCtrl($scope, $rootScope, $state, $window, $bzPopup, $uibModal, bzResourceSvc, userSvc, orderApiSvc,apiProductSvc) {
		var vmFavoriteProduct = this;

		vmFavoriteProduct.menuActive = "favorite-product";

		//Vars
		vmFavoriteProduct.formData = {};
		vmFavoriteProduct.imagesDirectory = settingJs.configs.uploadDirectory.thumb_product || '/files/thumb_image/product_image/';
		vmFavoriteProduct.submitted = false;
		vmFavoriteProduct.lockForm = false;
		vmFavoriteProduct.data = $window.data;
		vmFavoriteProduct.allowAddCart = true;

		// Methods
		vmFavoriteProduct.popupDetail = popupDetail;
		vmFavoriteProduct.addToCart = addToCart;
		vmFavoriteProduct.decreaseCart = decreaseCart;
		vmFavoriteProduct.getCart = getCart;
		vmFavoriteProduct.checkDateProduct = checkDateProduct;
		vmFavoriteProduct.checkImgOld = apiProductSvc.checkImgOld;
		vmFavoriteProduct.addToCartGA = apiProductSvc.addToCartGA;


		//Init
		angular.element('#mod-user-wishlist #hide1').removeClass('hide');
		// vmFavoriteProduct.tableParams = new NgTableParams({ count: 1 }, {counts: [], dataset: vmFavoriteProduct.data});

		function popupDetail(slug, id) {
			$window.history.pushState(null, "title", "/san-pham/" + slug + '-' + id);

			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: settings.services.webUrl + '/modules/web-product/view/client/popup/detail-product/view.html',
				controller: 'popupProductDetail',
				controllerAs: 'vmPopProDe',
				resolve: {
					product: function () {
						return angular.copy({
							slug: slug,
							id: id
						});
					},
				}
			});

			modalInstance.result.then(function (resp) {
				$window.history.back();
			}, function () {
				$window.history.back();
			});
		}

		function getCart(product) {
			if ($rootScope.Cart) {
				try {
					product.cart = $rootScope.Cart.items.find(function (item) {
						return product._id == item.id_product;
					});
				} catch(error) {
					product.cart = apiProductSvc.findByIdProduct($rootScope.Cart.items, product._id);
				}
				vmFavoriteProduct.allowAddCart = true;
            }
			return product.cart;
		}

		
		function addToCart(id) {
            if (vmFavoriteProduct.allowAddCart) {
                vmFavoriteProduct.allowAddCart = false;
                apiProductSvc.addToCart(id, function (resp) {
                    getCart(resp);
                })
            }
        }

		

		function decreaseCart(id, quantity) {
			// console.log(id);
            apiProductSvc.decreaseCart(id, quantity, function (resp) {
                getCart(resp);
            })
        }

		function checkDateProduct(end_date) {
			if (end_date) {
				end_date = moment(end_date);
				return moment().isBefore(end_date)
			}
			else {
				return true;
			}
		}
		//End func
	}
})();