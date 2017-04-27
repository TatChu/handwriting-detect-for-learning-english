var auditLogCtrl = (function () {
	'use strict';

	angular
		.module('bzAuditLog')
		.controller('auditLogCtrl', auditLogCtrl);

	function auditLogCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, $filter,
		NgTableParams, ngTableEventsChannel, authSvc, bzResourceSvc, listResource, auditLogSvc) {
		var vmLog = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('log', ['view'])))) {
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmLog.loading = true;
		vmLog.queryParams = $stateParams;
		vmLog.showPopupDetailLog = showPopupDetailLog;
		vmLog.filter = {
			action: vmLog.queryParams.action ? vmLog.queryParams.action : null,
			label: vmLog.queryParams.label ? vmLog.queryParams.label : null,

		};

		vmLog.listResource = listResource;
		// Methods
		vmLog.filterForm = filterForm;
		vmLog.clearFilter = clearFilter;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function () {
			$scope.vmLog.queryParams.page = vmLog.table.page();
			$state.go('.', $scope.vmLog.queryParams);
		}, $scope, vmLog.table);

		/*FUNCTION*/

		function showPopupDetailLog(log) {
			vmLog.detail = log;
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'modules/admin-log/view/client/popup/detail-log/view.html',
				controller: 'popupLogCtrl',
				resolve: {
					detailLog: function () {
						return angular.copy(log);
					},
				}
			});
		}

		function getData() {
			/*Start: set datetime picker*/
			var dateTimePickerOpt = {
				singleDatePicker: false
			};

			if (vmLog.queryParams.date) {
				var date = vmLog.queryParams.date.split(' - ');
				angular.extend(dateTimePickerOpt, {
					startDate: date[0],
					endDate: date[1],
				});
				angular.element('#datetime-picker').val(vmLog.queryParams.date);
			}
			vmLog.dateTimePickerOpt = dateTimePickerOpt;
			/*End: set datetime picker*/

			auditLogSvc.getLog(vmLog.queryParams).then(function (resp) {
				vmLog.queryParams.pageCount = resp.totalPage;
				vmLog.list = resp.items;

				vmLog.table = new NgTableParams({
					count: vmLog.queryParams.limit
				}, {
						counts: [],
						getData: function (params) {
							params.total(resp.totalItems);
							return vmLog.list;
						}
					});

				vmLog.table.page(vmLog.queryParams.page);
				vmLog.loading = false;
			})
		}

		function filterForm(form) {
			vmLog.queryParams.page = 1;
			if (vmLog.filter.date) {
				vmLog.queryParams.date = formatMomentDate(vmLog.filter.date.startDate) + ' - ' + formatMomentDate(vmLog.filter.date.endDate);
			}
			if (vmLog.filter.action != undefined) {
				vmLog.queryParams.action = vmLog.filter.action;
			}
			if (vmLog.filter.label) {
				vmLog.queryParams.label = vmLog.filter.label;
			}
			$state.go('.', vmLog.queryParams).then(function () {
				$state.reload();
			});
		}

		function clearFilter() {
			vmLog.queryParams.action = "";
			vmLog.queryParams.label = "";
			vmLog.queryParams.date = null;

			$state.go('.', vmLog.queryParams).then(function () {
				$state.reload();
			});
		}

		function formatMomentDate(date) {
			return date.format('DD/MM/YYYY');
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