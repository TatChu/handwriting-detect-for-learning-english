var unitsCtrl = (function(){
	'use strict';

	angular
	.module('bzUnit')
	.controller('unitsCtrl', unitsCtrl);

	function unitsCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
    userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, unitSvc){
		/* jshint validthis: true */
		var vmUnits = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('unit', ['view'])))) {
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmUnits.loading = true;
		vmUnits.selectedItems = [];
		vmUnits.queryParams = $stateParams;

		vmUnits.userRoles = userRoles;
		// console.log('test', userRoles);
		vmUnits.units = [];

		// Methods
		vmUnits.filter = filter;
		vmUnits.filterReset = filterReset;
		vmUnits.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmUnits.queryParams.page = vmUnits.table.page();
			$state.go('.',$scope.vmUnits.queryParams);
		}, $scope, vmUnits.table);

		function getData(){
			bzResourceSvc.api($window.settings.services.admin + '/unit')
					.get(vmUnits.queryParams, function(resp){
						vmUnits.queryParams.pageCount = resp.totalPage;
						vmUnits.listUnit = resp.items;

						vmUnits.table = new NgTableParams({count: 20}, {
							counts: [],
							getData: function(params) {
								params.total(resp.totalItems);
								return vmUnits.listUnit;
							}
						});
						vmUnits.table.page(vmUnits.queryParams.page);
						vmUnits.loading = false;
					});
			// unitSvc.getAll().then(function(resp){
			// 	vmUnits.queryParams.pageCount = resp.totalPage;
			// 	vmUnits.units = resp.items;
			// 	// console.log('test',vmUnits.units);

			// 	vmUnits.table = new NgTableParams({count: 10}, {
			// 		counts: [],
			// 		getData: function(params) {
			// 			params.total(resp.totalItems);
			// 			return vmUnits.units;
			// 		}
			// 	});
			// 	vmUnits.table.page(vmUnits.queryParams.page);
			// 	vmUnits.loading = false;
			// }).catch(function (err){
			// 	$bzPopup.toastr({
            //             type: 'error',
            //             data: {
            //                 title: 'Lấy dữ liệu',
            //                 message: err.data.message
            //             }
            //         });
			// });
		}

		function filter(params){
			$state.go('.', angular.extend(params, saleContact.queryParams),
				{notify:false})
			.then(function(){
				$state.reload();
			});
		}

		function filterReset(){
			$state.go('.', {
				publish: null,
				cateid: null,
				keyword: null,
				limit: settingJs.admin.itemPerPage
			}, {notify:false})
			.then(function(){
				$state.reload();
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
						bzResourceSvc.api($window.settings.services.admin + '/unit/:id', {id: '@id'})
						.delete({id: selected.ids}, function(resp){
							$bzPopup.toastr({
								type: 'success',
								data:{
									title: 'Xóa',
									message: 'Xóa đơn vị thành công!'
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