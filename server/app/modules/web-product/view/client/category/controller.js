var category = (function () {
	'use strict';

	angular
		.module('bzProduct')
		.controller('categoryCtrl', categoryCtrl);

	function categoryCtrl($scope, $window, $location, $uibModal, $rootScope, webProductSvc, orderApiSvc, apiProductSvc) {
		// Vars
		var vmCategory = $scope;
		vmCategory.data = $window.data;
		vmCategory.ga_category = $window.ga_category;
		vmCategory.sortListGa = ['ClickSortSanPhamNoiBat', 'ClickSortSanPhamBanChay', 'ClickSortSanPhamKhuyenMai'];
		vmCategory.sort_tag = $location.search().sort || '0';
		vmCategory.queries = [];
		vmCategory.allowAddCart = true;
		vmCategory.search = $location.search().q;
		vmCategory.tagProcessingsTmp = $location.search().filter ? $location.search().filter.split('.') : [];
		vmCategory.tagProcessings = vmCategory.data.tag_processing.map(function (item, key) {
			if (vmCategory.tagProcessingsTmp.indexOf(key.toString()) != -1) {
				return true;
			}
			return false;
		});

		// For event scroll show more
		vmCategory.countScroll = 1;

		vmCategory.milestone = [20, 16, 16]; // Số sản phẩm show mỗi lần scroll
		vmCategory.productsShowDone = 16; // Số sản phẩm show khi scroll hết số lần scroll
		vmCategory.milestoneShow = 3; // Số lần scroll không hiện nút show thêm sản phẩm
		// For test event scroll, comment when done
		// vmCategory.milestone = [4, 4, 4];
		// vmCategory.productsShowDone = 4;
		// vmCategory.milestoneShow = 3;

		vmCategory.sumProductShow = vmCategory.milestone[0];
		vmCategory.products_length = vmCategory.data.products.length;

		// Methods
		// vmCategory.countTag = countTag;
		vmCategory.sortTag = sortTag;
		vmCategory.popupDetail = apiProductSvc.popupDetailPro;
		vmCategory.addToCart = addToCart;
		vmCategory.decreaseCart = decreaseCart;
		vmCategory.showMoreProduct = showMoreProduct;
		vmCategory.filterTag = filterTag;
		vmCategory.reloadPage = reloadPage;
		vmCategory.addToCartGA = apiProductSvc.addToCartGA;

		vmCategory.$on('Cart:getCart', getCart);
		$(window).scroll(showMoreEvent);
		filterTag();

		/*FUNCTION*/
		angular.element('#mod-category .button-view-more').removeClass('hidden');
		angular.element('#mod-category .take-cart').removeClass('hidden');
		angular.element('#mod-category #product-list').removeAttr('style');
		stickySidebarCategory();

		function filterTag() {
			vmCategory.filter = [];
			vmCategory.tagProcessings.forEach(function (item, key) {
				if (item) vmCategory.filter.push(key);
			});
		}

		function sortTag() {
			helperJsCustom.GA('send', 'event', vmCategory.ga_category, vmCategory.sortListGa[parseInt(vmCategory.sort_tag)], '');
		}

		function stickySidebarCategory() {
			angular.element('#mod-category .col-left').stick_in_parent().on("sticky_kit:stick", function (e) {
				$(this).parent().find('.col-left').css('margin-top', '80px');
			}).on("sticky_kit:bottom", function (e) {
				$(this).parent().css('position', 'static');
			}).on("sticky_kit:unstick", function (e) {
				$(this).parent().find('.col-left').css('margin-top', '');
			});
		}

		function reloadPage() {
			var query = '';
			if (vmCategory.search) {
				vmCategory.queries.push({
					type: 'q',
					value: vmCategory.search
				})
			}
			vmCategory.queries.push({
				type: 'sort',
				value: vmCategory.sort_tag
			})
			if (vmCategory.filter.length > 0) {
				vmCategory.queries.push({
					type: 'filter',
					value: vmCategory.filter.join('.')
				})
			}
			vmCategory.queries.forEach(function (item, key) {
				if (key != 0) query += '&';
				query += item.type + '=' + item.value;
			})
			if (query.length > 0) {
				window.location.href = settingJs.configs.webUrl + $location.path() + '?' + query;
			}
		}

		function countTag(id_tag) {
			var countTag = 0;
			vmCategory.products_list.forEach(function (product) {
				var tag = product.tag_processing.find(function (tag) {
					return tag.id_tag == id_tag;
				});
				if (tag) return countTag++;
			});
			return countTag;
		}

		function getCart() {
			if ($rootScope.Cart) {
				try {
					vmCategory.data.products.forEach(function (product) {
						product.cart = $rootScope.Cart.items.find(function (item) {
							return item.id_product == product._id;
						});
					});
				} catch (error) {
					for (var index = 0; index < vmCategory.data.products.length; index++) {
						var element = vmCategory.data.products[index];
						vmCategory.data.products[index].cart = apiProductSvc.findByIdProduct($rootScope.Cart.items, element._id);
					}
				}

				vmCategory.allowAddCart = true;
			}

		}

		function addToCart(id) {
			if (vmCategory.allowAddCart) {
				vmCategory.allowAddCart = false;
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

		function showMoreProduct() {
			vmCategory.sumProductShow += vmCategory.productsShowDone;
			$('#mod-category .col-left').css({ 'position': 'fixed', 'top': '0' });
		}

		function showMoreEvent(event) {
			var footer_height = $('#mod-footer').height();
			var header_height = $('#header').height();
			var document_height = $(document).height();
			var end_products_list = (document_height - footer_height - header_height - 1000);
			if ($(this).scrollTop() > end_products_list && vmCategory.countScroll <= vmCategory.milestoneShow) {
				vmCategory.sumProductShow = 0;
				for (var index = 0; index < vmCategory.countScroll; index++) {
					var element = vmCategory.milestone[index];
					vmCategory.sumProductShow += vmCategory.milestone[index];
				}
				vmCategory.countScroll++;
				vmCategory.$apply();
			};
		}
	}
})();
