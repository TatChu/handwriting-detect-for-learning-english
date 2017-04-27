var orderListCtrl = (function () {
	'use strict';

	angular
		.module('bzOrder')
		.controller('orderListCtrl', orderListCtrl);

	function orderListCtrl($scope, $rootScope, $state, $stateParams, $bzPopup, $uibModal, $window, NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, statusOrderList, orderSvc) {
		var vmOrL = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('order', 'view')))) {
			$state.go('error403');
		}
		vmOrL.showBtnAdd = authSvc.hasPermission('order', 'add');
		vmOrL.showBtnEdit = authSvc.hasPermission('order', ['add', 'edit']);
		vmOrL.showBtnDelete = authSvc.hasPermission('order', 'delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmOrL.loading = true;
		vmOrL.queryParams = $stateParams;
		vmOrL.statusOrderList = statusOrderList;
		vmOrL.checkbox = [];

		// Methods
		vmOrL.detailOrderPop = detailOrderPop;
		vmOrL.getStatusOrder = getStatusOrder;
		vmOrL.deleteOrder = deleteOrder;
		vmOrL.filterForm = filterForm;
		vmOrL.clearFilter = clearFilter;
		vmOrL.exportExcel = exportExcel;
		vmOrL.selectAll = selectAll;
		vmOrL.exportPDF = exportPDF;

		// Init
		getData();

		setConfigsValue();
		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmOrL.queryParams.page = vmOrL.table.page();
			$state.go('.', $scope.vmOrL.queryParams);
		}, $scope, vmOrL.table);

		/*FUNCTION*/

		function selectAll() {
			vmOrL.list.forEach(function (item) {
				item.value_checkbox = vmOrL.checkbox.selectAll;
			});
		}

		function getData() {
			var image = new Image();
			var canvas = angular.element("#image")[0],
				canvasContext = canvas.getContext("2d");
			image.src = "/assets/admin/images/mhv.jpg";
			image.onload = function () {
				canvas.width = image.width;
				canvas.height = image.height;
				canvasContext.drawImage(image, 0, 0, image.width, image.height);
				vmOrL.dataURLImage = canvas.toDataURL();
			};

			/*Start: set datetime picker*/
			var dateTimePickerOpt = {
				singleDatePicker: false
			};

			if (vmOrL.queryParams.date) {
				var date = vmOrL.queryParams.date.split(' - ');
				angular.extend(dateTimePickerOpt, {
					startDate: date[0],
					endDate: date[1],
				});
				angular.element('#datetime-picker').val(vmOrL.queryParams.date);
			}

			vmOrL.dateTimePickerOpt = dateTimePickerOpt;
			/*End: set datetime picker*/

			orderSvc.getAll(vmOrL.queryParams).then(function (resp) {
				vmOrL.queryParams.pageCount = resp.totalPage;
				vmOrL.list = resp.items;
				vmOrL.params = resp.params;
				vmOrL.statusOrderList = statusOrderList;
				vmOrL.listCoupon = resp.listCoupon;
				vmOrL.filter = {};
				vmOrL.checkbox = {
					selectAll: false,
				}

				vmOrL.list.forEach(function (item) {
					item.value_checkbox = false;
				})

				if (vmOrL.queryParams.min_order) {
					vmOrL.filter.min_order = vmOrL.queryParams.min_order ? parseInt(vmOrL.queryParams.min_order) : undefined;
				}

				if (vmOrL.queryParams.max_order) {
					vmOrL.filter.max_order = vmOrL.queryParams.max_order ? parseInt(vmOrL.queryParams.max_order) : undefined;
				}

				if (vmOrL.queryParams.coupon) {
					vmOrL.couponDetail = vmOrL.listCoupon.find(function (item) {
						return item._id == vmOrL.queryParams.coupon;
					})
				}

				vmOrL.table = new NgTableParams({
					count: vmOrL.queryParams.limit
				}, {
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmOrL.list;
						}
					});

				vmOrL.table.page(vmOrL.queryParams.page);
				vmOrL.loading = false;
			})
		}

		function detailOrderPop(order) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'modules/admin-order/view/client/popup-order/detail-order/view.html',
				controller: 'popupOrderCtrl',
				resolve: {
					order: function () {
						return angular.copy(order);
					},
					permission: function () {
						return angular.copy(vmOrL.showBtnEdit);
					}
				}
			});

			modalInstance.result.then(function (resp) {
				angular.extend(order, resp);
			}, function () {
			});
		}

		function getStatusOrder(item) {
			return vmOrL.statusOrderList.find(function (value) {
				return item.status == value.value;
			})
		}

		function deleteOrder(id) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa ';
					$scope.message = 'Bạn muốn xóa đơn hàng này?';

					$scope.ok = function () {
						orderSvc.delete(id).then(function (resp) {
							if (resp.success) {
								vmOrL.queryParams.page = 1;
								$state.go('.', vmOrL.queryParams).then(function () {
									$state.reload();
								});
								$uibModalInstance.close();

								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Thành công!',
										message: 'Xóa đơn hàng thành công!'
									}
								});
							}
						}, function (resp) {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Xóa đơn hàng thất bại!'
								}
							});
						});
					}
				}
			});
		}

		function filterForm(form) {
			vmOrL.queryParams.page = 1;

			if (vmOrL.filter.date) {
				vmOrL.queryParams.date = formatDate(vmOrL.filter.date.startDate) + ' - ' + formatDate(vmOrL.filter.date.endDate);
			}
			vmOrL.queryParams.min_order = vmOrL.filter.min_order;
			vmOrL.queryParams.max_order = vmOrL.filter.max_order;

			$state.go('.', vmOrL.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmOrL.queryParams.customer_name = null;
			vmOrL.queryParams.coupon = null;
			vmOrL.queryParams.date = null;
			vmOrL.queryParams.status = null;
			vmOrL.queryParams.type = null;
			vmOrL.queryParams.type = null;
			vmOrL.queryParams.min_order = null;
			vmOrL.queryParams.max_order = null;
			$state.go('.', vmOrL.queryParams).then(function () {
				$state.reload();
			});
		}

		function formatDate(date) {
			return date.format('DD/MM/YYYY');
		}

		// Export Excel
		function exportExcel(list_data) {
			var data = [[
				'Mã đơn hàng', 'Ngày đặt hàng', 'Tên khách hàng', 'SĐT', 'Quận', 'Địa chỉ',
				'Sản phẩm', 'Số lượng', 'Số lượng thực giao', 'Đơn giá', 'Giảm giá', 'Tổng tiền khách đặt',
				'Phí ship', 'Ngày Giao Hàng', 'Đợt giao hàng', 'Đơn vị giao hàng', 'Ghi chú đơn hàng', 'Trạng thái đơn hàng'
			]];

			var options = {
				type: 'xlsx',
				sheetName: 'SheetJS1',
				fileName: 'Order',
			};

			list_data.forEach(function (item) {
				item.order_detail.forEach(function (product) {
					var promotionTxt = '';
					if (product.promotion) {
						switch (product.promotion.type) {
							case 'MN':
								promotionTxt += product.promotion.value + ' Đ';
								break;
							case 'PC':
								promotionTxt += product.promotion.value + ' %';
								break;
							default:
								promotionTxt += product.promotion.value + ' %';
								break;
						}

					}

					data.push([
						item.id_order, moment(item.createdAt).format('D/M/YYYY'), item.payment_info.info.full_name, item.payment_info.info.phone, item.payment_info.info.district,
						item.payment_info.info.address, product.product.name, product.order_quantity, '', product.price, promotionTxt, product.total, item.shipping_fee ? item.shipping_fee.fee : '',
						moment(item.ship_date).format('D/M/YYYY'), 'Đợt 1', item.shiper, item.note, getStatusOrder(item).name
					]);
				});
			});

			ExcelJs.exportExcel(data, options);
		}


		function setConfigsValue() {
			bzResourceSvc.api($window.settings.services.admin + '/configs')
				.get({}, function (resp) {
					$rootScope.promotionForOrderDeleveryOnAffternoon = resp.OrderDeleveryOnAffernoon;
					$rootScope.promotionForFirstOrder = resp.FirstOrder;
					$rootScope.freeShipUrban = resp.FreeShipConfig.Urban;
					$rootScope.freeShipSuburb = resp.FreeShipConfig.Suburb;
				}), function (err) {
				};
		}

		// Export Excel
		function exportExcel(list_data) {
			vmOrL.btnExportExcel = true;
			var data = [[
				'Mã coupon', 'Tên coupon'
			],
			[
				vmOrL.couponDetail.code, vmOrL.couponDetail.name
			], [
				'STT', 'Order id', 'Name', 'SĐT', 'Email', 'Địa chỉ giao hàng', 'Thời gian order',
				'Phí vận chuyển', 'Tổng tiền order', 'Giá trị coupon', 'Trạng thái order'
			]];
			var options = {
				type: 'xlsx',
				sheetName: 'SheetJS1',
				fileName: 'Order',
			};
			var query = (JSON.parse(JSON.stringify(vmOrL.queryParams)));
			query.limit = vmOrL.totalItems;

			orderSvc.getAll(query).then(function (resp) {
				resp.items.forEach(function (item, index) {
					var category_txt = '';

					data.push([
						index + 1, item.id_order, item.payment_info.info.full_name, item.payment_info.info.phone, item.payment_info.info.email,
						item.payment_info.info.address + '- ' + item.payment_info.info.district, item.createdAt, item.payment_info.info.shipping_fee + ' đ',
						item.total, item.coupon.value, getStatusOrder(item).name
					]);
				});
				ExcelJs.exportExcel(data, options);
				vmOrL.btnExportExcel = false;
			}).catch(function (error) {
				console.log(error);
				vmOrL.btnExportExcel = false;
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Xuất Excel thất bại!'
					}
				});
			});
		}

		function exportPDF() {
			vmOrL.btnExportPDF = true;
			var contents = [];
			var styles = {
				textGreen: {
					color: '#00a65a',
					bold: true
				},
				textRed: {
					color: '#dd4b39'
				}
			};
			var defaultStyle = {};
			var count = 0;
			var export_pdf_list = [];
			try {
				vmOrL.list.forEach(function (item, index) {
					if (item.value_checkbox) {
						export_pdf_list.push(item);
						var content = [];
						var detail = {
							table: {
								widths: ['*', 'auto'],
								body: [
									[{
										text: 'Mã hóa đơn: #' + item.id_order
										+ '\nMã đơn hàng: #' + item.id_order
										+ '\nNgày giao hàng: ' + moment(item.createdAt).format('DD-MM-YYYY'),
										fillColor: '#737373',
										color: 'white',
										margin: [5, 5]
									}, {
										image: vmOrL.dataURLImage,
										width: 200,
										height: 45,
										fillColor: '#737373',
										margin: [5, 5]
									}],
								]
							},
							layout: 'noBorders',
						};
						if (count != 0) {
							detail.pageBreak = 'before';
						}
						content.push(detail);
						count++;

						var text_user_infor = '';
						if (item.payment_info.info.user_id) {
							text_user_infor += item.payment_info.info.user_id.name;
							text_user_infor += '\nSố điện thoại: ';
							text_user_infor += item.payment_info.info.user_id.phone ? item.payment_info.info.user_id.phone : '';
							text_user_infor += '\nEmail: ';
							text_user_infor += item.payment_info.info.user_id.email ? item.payment_info.info.user_id.email : '';
						}

						var vocative = item.payment_info.info.vocative || item.payment_info.info.vocative != "undefined" ? item.payment_info.info.vocative + ' ' : '';

						content.push({
							table: {
								widths: [248, 248],
								headerRows: 1,
								body: [
									[{
										text: 'Thông tin mua hàng',
										fillColor: '#edebeb',
									}, {
										text: 'Thông tin nhận hàng',
										fillColor: '#edebeb',
									}],
									[{
										text: text_user_infor,
										border: [true, false, false, true],
									}, {
										text: vocative + item.payment_info.info.full_name
										+ '\nSố điện thoại: ' + item.payment_info.info.phone
										+ '\nĐịa chỉ: ' + item.payment_info.info.address + ', ' + item.payment_info.info.district,
										border: [false, true, true, true],
									}]
								],
							}
						});

						content.push({
							text: '',
							margin: [0, 0, 0, 20],
						});

						content.push({
							table: {
								widths: [248, 248],
								headerRows: 1,
								body: [
									[{
										text: 'Phương thức thanh toán',
										fillColor: '#edebeb',
									}, {
										text: 'Phương thức vận chuyển',
										fillColor: '#edebeb',
									}],
									[{
										text: item.payment_method == "COD" ? 'Thanh toán khi giao hàng (COD)' : 'Chuyển khoản',
										border: [true, false, false, true],
									}, {

										text: [{
											text: item.payment_info.info.shipping_fee == 0 ? 'Miễn phí\n' : '',
										}, {
											text: '(Phí vận chuyển ' + orderSvc.formatCurrency(item.payment_info.info.shipping_fee) + ' ₫)',
										}],
										border: [false, true, true, true],
									}]
								],
							}
						});

						content.push({
							text: '',
							margin: [0, 0, 0, 20],
						});

						var order_detail_content = [
							[{
								text: 'Sản phẩm',
								fillColor: '#edebeb',
								border: [true, true, false, true],
							}, {
								text: 'TL/ĐVT',
								fillColor: '#edebeb',
								border: [false, true, false, true],
								alignment: 'right'
							}, {
								text: 'Số lượng',
								fillColor: '#edebeb',
								border: [false, true, false, true],
								alignment: 'right'
							},
							{
								text: 'Giá',
								fillColor: '#edebeb',
								border: [false, true, false, true],
								alignment: 'right'
							},
							{
								text: 'Tổng tiền',
								fillColor: '#edebeb',
								border: [false, true, true, true],
								alignment: 'right'
							}],
						];

						item.order_detail.forEach(function (item) {
							if (item.product) {
								var price = item.price;
								if (item.id_promote) {
									if (item.id_promote.type == 'PC') {
										price = price * (100 - item.id_promote.value) / 100
									}
									if (item.id_promote.type == 'MN') {
										price = price - item.id_promote.value;
									}
								}
								order_detail_content.push([
									{
										text: item.product.name,
										border: [false, false, false, false],
										margin: [0, 0, 0, 5]
									},
									{
										text: item.product.view_unit ? item.product.view_unit : '',
										border: [false, false, false, false],
										alignment: 'right',
										margin: [0, 0, 0, 5]
									},
									{
										text: item.order_quantity + '',
										border: [false, false, false, false],
										alignment: 'right',
										margin: [0, 0, 0, 5]
									},
									{
										text: orderSvc.formatCurrency(price) + ' ₫',
										border: [false, false, false, false],
										alignment: 'right',
										margin: [0, 0, 0, 5]
									},
									{
										text: orderSvc.formatCurrency(item.total) + ' ₫',
										border: [false, false, false, false],
										alignment: 'right',
										margin: [0, 0, 0, 5]
									}
								]);
							}
						});

						content.push({
							table: {
								widths: [206, 80, 60, 60, 63],
								headerRows: 1,
								body: order_detail_content,
							}
						});

						content.push({
							text: '',
							margin: [0, 0, 0, 40],
						});

						var detail_order = [];

						var is_free = item.payment_info.info.shipping_fee == 0 ? '(Miễn phí)' : '';

						var order_detail = [
							['', 'Tổng cộng: ', orderSvc.formatCurrency(item.total) + ' ₫'],
							['', {
								text: ['Khuyến mãi: ', { text: item.id_coupon ? '(' + item.coupon.name + '): ' : '', style: 'textGreen' }]
							}, {
									text: [
										{ text: item.coupon.value > 0 ? '-' + orderSvc.formatCurrency(item.coupon.value) : 0 }, ' ₫'
									]
								}
							],

							['', {
								text: [
									'Phí vận chuyển ',
									{ text: is_free, style: 'textRed' },
									':'
								]
							}, orderSvc.formatCurrency(item.payment_info.info.shipping_fee) + ' ₫']
						]

						if (item.delivery_time == 'CHIEU' && $rootScope.promotionForOrderDeleveryOnAffternoon.status) {
							var text_price = ($rootScope.promotionForOrderDeleveryOnAffternoon.type == "PC" ?
								(($rootScope.promotionForOrderDeleveryOnAffternoon.value / 100) * item.total)
								: $rootScope.promotionForOrderDeleveryOnAffternoon.value);
							order_detail.push(['', {
								text: [
									{
										text: $rootScope.promotionForOrderDeleveryOnAffternoon.description,
										style: 'textGreen'
									}, ': '
								],
							}, '-' + orderSvc.formatCurrency(text_price) + ' ₫']);
						}

						if (item.is_first_order) {
							var text_price = $rootScope.promotionForFirstOrder.type == "MN" ?
								$rootScope.promotionForFirstOrder.value
								: (($rootScope.promotionForFirstOrder.value / 100) * item.total);
							order_detail.push(['', {
								text: [
									{
										text: $rootScope.promotionForFirstOrder.description,
										style: 'textGreen'
									}, ': '
								],
							}, '-' + orderSvc.formatCurrency(text_price) + ' ₫']);
						}

						if (item.shipping_fee) {
							if (item.shipping_fee.type == '1' && item.total > $rootScope.freeShipUrban.value) {
								order_detail.push([{
									text: [
										{
											text: $rootScope.freeShipUrban.description,
											style: 'textGreen'
										}
									],
									colSpan: 3,
								}]);
							}

							if (item.shipping_fee.type == '2' && item.total > $rootScope.freeShipSuburb.value) {
								order_detail.push([{
									text: [
										{
											text: $rootScope.freeShipSuburb.description,
											style: 'textGreen'
										}
									],
									colSpan: 3,
								}]);
							}
						}

						order_detail.push(['', 'Tổng tiền: ', orderSvc.formatCurrency(item.total_pay) + ' ₫',])

						content.push({
							table: {
								widths: [56, 340, 100],
								headerRows: 1,
								body: order_detail,
							},
							alignment: 'right',
							layout: 'noBorders'
						});

						content.push({
							text: item.note ? 'Ghi chú: ' + item.note : '',
						});

						contents.push(content);
					}
				});
				var document = {
					content: contents,
					styles: styles,
					defaultStyle: defaultStyle
				};

				// Select name file order
				if (count == 0) {
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Chưa chọn hóa dơn!',
							message: 'Vui lòng chọn hóa đơn bạn muốn xuất!'
						}
					});
				}
				else {
					if (count == 1) {
						pdfMake.createPdf(document).download(export_pdf_list[0].id_order + '.pdf');
					}
					else {
						pdfMake.createPdf(document).download(moment(export_pdf_list[0].createdAt).format('DDMMYY') + '.pdf');
					}
				}

				vmOrL.btnExportPDF = false;
			} catch (error) {
				vmOrL.btnExportPDF = false;
				console.log(error);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Xuất PDF thất bại!'
					}
				});
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