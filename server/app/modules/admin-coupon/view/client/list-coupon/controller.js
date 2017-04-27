var couponCtrl = (function(){
	'use strict';

	angular
	.module('bzCoupon')
	.controller('couponCtrl', couponCtrl);

	function couponCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
    userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, couponSvc){
		/* jshint validthis: true */
		var vmCoupons = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('coupon','view') ))){
            $state.go('error403');
        }

		vmCoupons.showBtnAdd = authSvc.hasPermission('coupon','add');
		vmCoupons.showBtnEdit = authSvc.hasPermission('coupon',['add','edit']);
		vmCoupons.showBtnDelete = authSvc.hasPermission('coupon','delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmCoupons.loading = true;
		vmCoupons.selectedItems = [];
		vmCoupons.queryParams = $stateParams;
		vmCoupons.keyword = $stateParams.keyword;
		vmCoupons.userRoles = userRoles;
		// console.log('test', userRoles);
		vmCoupons.coupons = [];

		// Methods
		vmCoupons.filter = filter;
		vmCoupons.filterReset = filterReset;
		vmCoupons.sort = sort;
		vmCoupons.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmCoupons.queryParams.page = vmCoupons.table.page();
			$state.go('.',$scope.vmCoupons.queryParams);
		}, $scope, vmCoupons.table);

		function getData(){
			bzResourceSvc.api($window.settings.services.admin + '/coupon')
			.get(vmCoupons.queryParams, function(resp){
				vmCoupons.queryParams.pageCount = resp.totalPage;
				vmCoupons.coupons = resp.items;

				vmCoupons.table = new NgTableParams({count: 20}, {
					counts: [],
					getData: function(params) {
						params.total(resp.totalItems);
						return vmCoupons.coupons;
					}
				});
				vmCoupons.table.page(vmCoupons.queryParams.page);
				vmCoupons.loading = false;
			});
		}

		function filter(keyword) {
			$state.go('.', {
				keyword: keyword,
				page: vmCoupons.queryParams.page,
			}).then(function () {
				$state.reload();
			});
		}

		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmCoupons.queryParams.page,
				// publish: null,
				// cateid: null,
				// limit: settingJs.admin.itemPerPage
			}, { notify: false })
				.then(function () {
					$state.reload();
				});
		}

		

		function sort(id, value){
			$bzPopup.toastr({
				type: 'success',
				data:{
					title: 'Cập nhật',
					message: 'Cập nhật thứ tự phiếu mua hàng thành công!'
				}
			});
		}

		function remove(id){
			var selected = {ids: [id]}; //id ? {ids: [id]} : getSelectedIds();
			console.log('asd',id);

			var modalInstance = $uibModal.open({
				animation:true,
				templateUrl: 'assets/global/message/view.html',
				controller: function($scope, $uibModalInstance){
					$scope.popTitle = 'Xóa'; 
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?'; 
					$scope.ok = function(){
						bzResourceSvc.api($window.settings.services.admin + '/coupon/:id', {id: '@id'})
						.delete({id: selected.ids}, function(resp){
							$bzPopup.toastr({
								type: 'success',
								data:{
									title: 'Xóa',
									message: 'Xóa phiếu mua hàng thành công!'
								}
							});
							$state.reload();
							$uibModalInstance.close();
						});
					};
				}
			});
		}
	}

	var resolve = {
		/* @ngInject */
		preload: function(bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve : resolve
	};
})();