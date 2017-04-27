var orderAddCtrl = (function () {
	'use strict';

	angular
		.module('bzOrder')
		.controller('orderAddCtrl', orderAddCtrl);

	function orderAddCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, $timeout,
		NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, orderSvc, statusOrderList, shipperList, productSvc, listVocative) {
		var vmOrA = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('order', 'add')))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmOrA.loading = true;
		vmOrA.queryParams = $stateParams;
		vmOrA.statusOrderList = statusOrderList;
		vmOrA.shipperList = shipperList;
		vmOrA.urlImg = settingJs.configs.uploadDirectory.thumb_product;
		vmOrA.dateTimePickerOpt = {
		};

		vmOrA.customerSignIn = 'true'; //Khách hàng đã đăng ký hoặc chưa
		vmOrA.listVocative = listVocative;
		// Methods
		vmOrA.getDataShippingFee = getDataShippingFee;
		vmOrA.getOrderDetail = getOrderDetail;
		vmOrA.getCoupon = getCoupon;
		vmOrA.setPaymentInfo = setPaymentInfo;
		vmOrA.setDataUser = setDataUser;
		vmOrA.addOrder = addOrder;
		vmOrA.setTotalProduct = setTotalProduct;
		vmOrA.enableForm = enableForm;
		vmOrA.checkImgOld = productSvc.checkImgOld;
		// Init
		getData();
		getCoupon();

		/*FUNCTION*/
		function getData() {
			orderSvc.add().then(function (resp) {
				vmOrA.listCoupon = resp.listCoupon;
				vmOrA.listProduct = resp.listProduct;
				vmOrA.listShippingFee = resp.listShippingFee;
				vmOrA.listUser = resp.listUser;
				vmOrA.configNT = resp.configNT;
				vmOrA.configNGT = resp.configNGT;
				vmOrA.configBC = resp.configBC;
				vmOrA.configDT = resp.configDT;
				vmOrA.orderAddTmp = {};
				vmOrA.shippingTmp = {
					fee: 0
				};
				vmOrA.isFirstOder = false;

				vmOrA.orderDetailTmp = vmOrA.listProduct.map(function (item) {
					return {
						product_obj: item,
						product: item._id,
						order_quantity: 0,
						price: item.price,
						total: 0,
						id_promote: item.promotion ? {
							id: item.promotion._id,
							name: item.promotion.name,
							value: item.promotion.value,
							type: item.promotion.type
						} : null
					};
				});

				// Create default data
				vmOrA.orderAdd = {
					delivery_type: 'CN',
					delivery_time: 'SANG',
					payment_method: 'COD',
					type: 'BT',
					payment_info: {
						info: {
							shipping_fee: 0
						}
					},
					order_detail: [],
					total: 0,
					status: vmOrA.statusOrderList[0].value,
					id_coupon: null,
					shiper: vmOrA.shipperList[0].value,
					coupon: {
						value: 0,
						code: "",
						name: ""
					}
				};

				vmOrA.loading = false;
			});
		}

		// Get data from select coupon
		function getCoupon(showNoti) {
			if (showNoti == undefined) showNoti = false;
			if (vmOrA.orderAdd && vmOrA.orderAdd.id_coupon != "") {
				let couponTmp = {};
				vmOrA.listCoupon.forEach(function (item) {
					if (vmOrA.orderAdd.id_coupon == item._id) {
						couponTmp = item;
					}
				});
				orderSvc.checkCoupon(vmOrA.orderAdd, couponTmp.code).then(function (resp) {
					if (resp.success) {
						vmOrA.orderAdd.id_coupon = resp.coupon._id;
						vmOrA.orderAdd.coupon.value = resp.money_coupon;
						vmOrA.orderAdd.coupon.code = resp.coupon.code;
						vmOrA.orderAdd.coupon.name = resp.coupon.name;
						if (showNoti)
							$bzPopup.toastr({
								type: 'success',
								data: {
									title: 'Thành công',
									message: 'Đơn hàng đang được giảm ' + vmOrA.orderAdd.coupon.value + ' đ'
								}
							});
					}
					else {
						vmOrA.orderAdd.id_coupon = null;
						vmOrA.orderAdd.coupon.value = 0;
						vmOrA.orderAdd.coupon.code = "";
						vmOrA.orderAdd.coupon.name = "";

						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Mã giảm giá',
								message: resp.err.message
							}
						});
					}
				}).catch(function (err) {
					console.log(111, err)
				})
			}
			if (vmOrA.orderAdd) {
				vmOrA.orderAddTmp.coupon = vmOrA.listCoupon.find(function (item) {
					return vmOrA.orderAdd.id_coupon == item._id;
				});
				vmOrA.orderAdd.coupon = null;
				if (vmOrA.orderAddTmp.coupon) {
					vmOrA.orderAdd.coupon = {
						code: vmOrA.orderAddTmp.coupon.code,
						name: vmOrA.orderAddTmp.coupon.name,
						value: vmOrA.orderAddTmp.coupon.sale.is_money ? vmOrA.orderAddTmp.coupon.sale.money_value : vmOrA.orderAddTmp.coupon.sale.percent_value,
						type: vmOrA.orderAddTmp.coupon.sale.is_money ? 'MN' : 'PC'
					}
				}
			}
		}

		// Create order detail from select list product
		function getOrderDetail() {
			vmOrA.orderAdd.order_detail = [];
			if (vmOrA.orderAddTmp.orderDetailProduct) {
				vmOrA.orderAdd.order_detail = vmOrA.orderAddTmp.orderDetailProduct.map(function (product) {
					var findProduct = vmOrA.orderDetailTmp.find(function (order) {
						return order.product === product;
					});
					return findProduct;
				});
			}
		}

		// Set payment info from radio button
		function setPaymentInfo() {
			var shippingAddressID = vmOrA.orderAddTmp.shippingAddress;
			var shippingAddress = vmOrA.orderAddTmp.user.customer.shipping_address.find(function (item) {
				return shippingAddressID == item._id;
			});

			angular.extend(vmOrA.orderAdd.payment_info.info, {
				id_shipping_address: shippingAddress._id,
				full_name: shippingAddress.name,
				phone: shippingAddress.phone,
				address: shippingAddress.address_detail,
				district: shippingAddress.id_shipping_fee.district,
				shipping_fee: shippingAddress.id_shipping_fee.fee
			});
			getDataShippingFee();
		}

		// Get data from select district
		function getDataShippingFee() {
			var district = vmOrA.orderAdd.payment_info.info.district;

			vmOrA.shippingTmp = vmOrA.listShippingFee.find(function (item) {
				return item.district == district;
			})

			vmOrA.orderAdd.id_shipping_fee = vmOrA.shippingTmp ? vmOrA.shippingTmp._id : null;
		}

		// Get data from select user
		function setDataUser(value) {
			var user = vmOrA.orderAddTmp.user;
			orderSvc.isFirstOrder(user._id).then(function (resp) {
				vmOrA.isFirstOder = resp.isFirstOrder;
			})
			vmOrA.orderAdd.payment_info.info = {
				user_id: user._id,
				email: user.email,
				vocative: user.vocative,
				shipping_fee: 0
			};

			// When select from view, refresh select address
			if (value) {
				vmOrA.orderAdd.payment_info.info.district = null;
				vmOrA.orderAddTmp.shippingAddress = null;
				getDataShippingFee();
			}
		}

		// Calculate from input order quantity
		function setTotalProduct() {
			vmOrA.orderAdd.total = vmOrA.orderAdd.order_detail.reduce(function (sum, item) {
				item.total = calculateProduct(item.price, item.id_promote) * item.order_quantity;
				var total = isNaN(item.total) ? 0 : item.total;
				return sum + total;
			}, 0);

			vmOrA.orderAdd.total_pay = (vmOrA.orderAdd.total + vmOrA.orderAdd.payment_info.info.shipping_fee)
				- vmOrA.orderAdd.coupon.value
				- ((vmOrA.orderAdd.delivery_time == 'CHIEU') ?
					(vmOrA.configBC.type == "PC" ?
						((vmOrA.configBC.value / 100) * vmOrA.orderAdd.total)
						: vmOrA.configBC.value)
					: 0)
				- (vmOrA.isFirstOder ?
					(vmOrA.configDT.type == "MN" ?
						vmOrA.configDT.value
						: ((vmOrA.configDT.value / 100) * vmOrA.orderAdd.total)) : 0);
		}

		// Calculate price product
		function calculateProduct(price, promotion) {
			if (promotion) {
				if (promotion.type == 'PC') {
					return price * (100 - promotion.value) / 100;
				}
				if (promotion.type == 'MN') {
					return price - promotion.value;
				}
			}
			return price;
		}

		// Submit form add order
		function addOrder(form) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Thông tin đơn hàng chưa hợp lệ',
						message: 'Hãy thử lại'
					}
				});
				return;
			}
			if (!vmOrA.orderAddTmp.shippingAddress) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Thông tin địa chỉ giao hàng chưa hợp lệ',
						message: 'Hãy thử lại'
					}
				});
				return;
			}
			form.$submitted = false;
			console.log(vmOrA.orderAdd);

			orderSvc.create({
				data: vmOrA.orderAdd,
				coupon: vmOrA.orderAddTmp.coupon
			}).then(function (resp) {
				if (resp.success) {
					// form.$submitted = false;
					$bzPopup.toastr({
						type: 'success',
						data: {
							title: 'Thành công!',
							message: 'Order thành công!'
						}
					});
					$state.go('order-list');
				}
				else {
					form.$submitted = false;
					console.log(resp);
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Lỗi!',
							message: 'Order thất bại!'
						}
					});
				}
			}, function (err) {
				console.log(err);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Order thất bại!'
					}
				});
				form.$submitted = false;
			});
		}

		// Enable submit button
		function enableForm(form) {
			if (form) {
				form.$submitted = false;
			}
		}
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