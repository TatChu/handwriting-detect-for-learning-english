var orderReportCtrl = (function () {
	'use strict';

	angular
		.module('bzOrder')
		.controller('orderReportCtrl', orderReportCtrl);

	function orderReportCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, statusOrderList, orderSvc) {
		var vmOrR = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('order', 'export')))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmOrR.loading = true;
		vmOrR.queryParams = $stateParams;
		vmOrR.statusOrderList = statusOrderList;

		// Methods
		vmOrR.getStatusOrder = getStatusOrder;
		vmOrR.filterForm = filterForm;
		vmOrR.clearFilter = clearFilter;
		vmOrR.exportExcel = exportExcel;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmOrR.queryParams.page = vmOrR.table.page();
			$state.go('.', $scope.vmOrR.queryParams);
		}, $scope, vmOrR.table);


		/*FUNCTION*/
		function getData() {
			/*Start: set datetime picker*/
			var dateTimePickerOpt = {
				singleDatePicker: false
			};

			if (vmOrR.queryParams.date) {
				var date = vmOrR.queryParams.date.split(' - ');
				angular.extend(dateTimePickerOpt, {
					startDate: date[0],
					endDate: date[1],
				});
				angular.element('#datetime-picker').val(vmOrR.queryParams.date);
			}
			vmOrR.dateTimePickerOpt = dateTimePickerOpt;
			/*End: set datetime picker*/

			bzResourceSvc.api($window.settings.services.admin + '/order')
				.get(vmOrR.queryParams, function (resp) {
					vmOrR.queryParams.pageCount = resp.totalPage;
					vmOrR.list = resp.items;
					vmOrR.params = resp.params;
					vmOrR.statusOrderList = statusOrderList;
					vmOrR.listCoupon = resp.listCoupon;
					vmOrR.filter = {};

					if (vmOrR.queryParams.min_order) {
						vmOrR.filter.min_order = vmOrR.queryParams.min_order ? parseInt(vmOrR.queryParams.min_order) : undefined;
					}

					if (vmOrR.queryParams.max_order) {
						vmOrR.filter.max_order = vmOrR.queryParams.max_order ? parseInt(vmOrR.queryParams.max_order) : undefined;
					}

					vmOrR.table = new NgTableParams({
						count: vmOrR.queryParams.limit
					}, {
							counts: [],
							getData: function (params) {
								params.total(resp.totalItems);
								return vmOrR.list;
							}
						});

					vmOrR.table.page(vmOrR.queryParams.page);
					vmOrR.loading = false;
				});
		}


		function getStatusOrder(item) {
			return vmOrR.statusOrderList.find(function (value) {
				return item.status == value.value;
			})
		}

		function filterForm(form) {
			vmOrR.queryParams.page = 1;

			if (vmOrR.filter.date) {
				vmOrR.queryParams.date = formatDate(vmOrR.filter.date.startDate) + ' - ' + formatDate(vmOrR.filter.date.endDate);
			}

			vmOrR.queryParams.min_order = vmOrR.filter.min_order;
			vmOrR.queryParams.max_order = vmOrR.filter.max_order;

			$state.go('.', vmOrR.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmOrR.queryParams.customer_name = null;
			vmOrR.queryParams.coupon = null;
			vmOrR.queryParams.date = null;
			vmOrR.queryParams.status = null;
			vmOrR.queryParams.type = null;
			vmOrR.queryParams.min_order = null;
			vmOrR.queryParams.max_order = null;
			$state.go('.', vmOrR.queryParams).then(function () {
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
					if (product.id_promote.id) {
						switch (product.id_promote.type) {
							case 'MN':
								promotionTxt += product.id_promote.value + ' Đ';
								break;
							case 'PC':
								promotionTxt += product.id_promote.value + ' %';
								break;
							default:
								promotionTxt += product.id_promote.value + ' %';
								break;
						}
					}

					data.push([
						item.id_order, moment(item.createdAt).format('D/M/YYYY'), item.payment_info.info.full_name, item.payment_info.info.phone, item.payment_info.info.district,
						item.payment_info.info.address, product.product.name, product.order_quantity, '', orderSvc.formatCurrency(product.price), promotionTxt, orderSvc.formatCurrency(product.total), orderSvc.formatCurrency(item.shipping_fee.fee),
						moment(item.ship_date).format('D/M/YYYY'), 'Đợt 1', item.shiper, item.note, getStatusOrder(item).name
					]);
				});
			});

			ExcelJs.exportExcel(data, options);
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