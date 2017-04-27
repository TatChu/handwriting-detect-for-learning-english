var shippingfeeCtrl = (function(){
	'use strict';

	angular
	.module('bzShippingFee')
	.controller('shippingfeeCtrl', shippingfeeCtrl);

	function shippingfeeCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
    userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, shippingfeeSvc){
		/* jshint validthis: true */
		var vmShippingFees = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('shipping','view') ))){
            $state.go('error403');
        }
		vmShippingFees.showBtnAdd = authSvc.hasPermission('shipping','add');
		vmShippingFees.showBtnEdit = authSvc.hasPermission('shipping',['add','edit']);
		vmShippingFees.showBtnDelete = authSvc.hasPermission('shipping','delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmShippingFees.loading = true;
		vmShippingFees.selectedItems = [];
		vmShippingFees.queryParams = $stateParams;
		vmShippingFees.keyword = $stateParams.keyword;

		vmShippingFees.userRoles = userRoles;
		vmShippingFees.shippingfees = [];
		// Methods
		vmShippingFees.filter = filter;
		vmShippingFees.filterReset = filterReset;
		vmShippingFees.sort = sort;
		vmShippingFees.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmShippingFees.queryParams.page = vmShippingFees.table.page();
			$state.go('.',$scope.vmShippingFees.queryParams);
		}, $scope, vmShippingFees.table);

		function getData(){
			bzResourceSvc.api($window.settings.services.admin + '/shippingfee')
			.get(vmShippingFees.queryParams, function(resp){
				vmShippingFees.queryParams.pageCount = resp.totalPage;
				vmShippingFees.shippingfees = resp.items;

				vmShippingFees.table = new NgTableParams({count: 10}, {
					counts: [],
					getData: function(params) {
						params.total(resp.totalItems);
						return vmShippingFees.shippingfees;
					}
				});
				vmShippingFees.table.page(vmShippingFees.queryParams.page);
				vmShippingFees.loading = false;
			});
		}
		
		

        

		function filter(keyword) {
			$state.go('.', {
				keyword: keyword,
				page: vmShippingFees.queryParams.page,
			}).then(function () {
				$state.reload();
			});
		}

		
		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmShippingFees.queryParams.page,
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
					message: 'Cập nhật thứ tự bài viết thành công!'
				}
			});
		}

		function remove(id){
			var selected = {ids: [id]}; //id ? {ids: [id]} : getSelectedIds();

			var modalInstance = $uibModal.open({
				animation:true,
				templateUrl: 'assets/global/message/view.html',
				controller: function($scope, $uibModalInstance){
					$scope.popTitle = 'Xóa'; 
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?'; 
					$scope.ok = function(){
						bzResourceSvc.api($window.settings.services.admin + '/shippingfee/:id', {id: '@id'})
						.delete({id: selected.ids}, function(resp){
							$bzPopup.toastr({
								type: 'success',
								data:{
									title: 'Xóa',
									message: 'Xóa phí vận chuyển thành công!'
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