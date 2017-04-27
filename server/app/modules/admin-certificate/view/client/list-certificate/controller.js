var certificateCtrl = (function(){
	'use strict';

	angular
	.module('bzCertificate')
	.controller('certificateCtrl', certificateCtrl);

	function certificateCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
    userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, certificateSvc){
		/* jshint validthis: true */
		var vmCertificates = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('certificate','view') ))){
            $state.go('error403');
        }

		vmCertificates.showBtnAdd = authSvc.hasPermission('certificate','add');
		vmCertificates.showBtnEdit = authSvc.hasPermission('certificate',['add','edit']);
		vmCertificates.showBtnDelete = authSvc.hasPermission('certificate','delete');
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmCertificates.loading = true;
		vmCertificates.selectedItems = [];
		vmCertificates.queryParams = $stateParams;
		vmCertificates.keyword = $stateParams.keyword;

		vmCertificates.userRoles = userRoles;
		// console.log('test', userRoles);
		vmCertificates.certificates = [];
		vmCertificates.imagesDerectory = settingJs.configs.uploadDirectory.certificate;

		// Methods
		vmCertificates.filter = filter;
		vmCertificates.filterReset = filterReset;
		vmCertificates.sort = sort;
		vmCertificates.remove = remove;

		// Init
		getData();

		ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmCertificates.queryParams.page = vmCertificates.table.page();
			$state.go('.',$scope.vmCertificates.queryParams);
		}, $scope, vmCertificates.table);

		function getData(){
			bzResourceSvc.api($window.settings.services.admin + '/certificate')
			.get(vmCertificates.queryParams, function(resp){
				vmCertificates.queryParams.pageCount = resp.totalPage;
				vmCertificates.certificates = resp.items;

				vmCertificates.table = new NgTableParams({count: 20}, {
					counts: [],
					getData: function(params) {
						params.total(resp.totalItems);
						return vmCertificates.certificates;
					}
				});
				vmCertificates.table.page(vmCertificates.queryParams.page);
				vmCertificates.loading = false;
			});
		}

		function filter(keyword) {
			$state.go('.', {
				keyword: keyword,
				page: vmCertificates.queryParams.page,
			}).then(function () {
				$state.reload();
			});
		}

		
		function filterReset() {
			$state.go('.', {
				keyword: null,
				page: vmCertificates.queryParams.page,
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
					message: 'Cập nhật thứ tự chứng chỉ thành công!'
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
						bzResourceSvc.api($window.settings.services.admin + '/certificate/:id', {id: '@id'})
						.delete({id: selected.ids}, function(resp){
							$bzPopup.toastr({
								type: 'success',
								data:{
									title: 'Xóa',
									message: 'Xóa chứng chỉ thành công!'
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