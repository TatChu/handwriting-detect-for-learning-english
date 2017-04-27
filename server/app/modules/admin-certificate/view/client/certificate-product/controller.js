var certificateProductCtrl = (function(){
	'use strict';

	angular
	.module('bzCertificate')
	.controller('certificateProductCtrl', certificateProductCtrl);

	function certificateProductCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
    userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, certificateSvc,tagSvc,productSvc){
		/* jshint validthis: true */
		var vmCertificateProduct = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('certificate','view') ))){
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmCertificateProduct.loading = true;
		vmCertificateProduct.submitted = false;
		vmCertificateProduct.lockForm = false;
		vmCertificateProduct.queryParams = $stateParams;
		vmCertificateProduct.cerID = $stateParams.id;
		vmCertificateProduct.userRoles = userRoles;
		vmCertificateProduct.certificates = [];
		vmCertificateProduct.imagesDerectory = settingJs.configs.uploadDirectory.product;

		// Methods
		vmCertificateProduct.filter = filter;
		vmCertificateProduct.filterReset = filterReset;
		vmCertificateProduct.sort = sort;
		vmCertificateProduct.addCertificateProduct = addCertificateProduct;
		vmCertificateProduct.delCertificateProduct = delCertificateProduct
		
		

		// Init
		getCertificate();
		getData();
		

		ngTableEventsChannel.onPagesChanged(function() {
			$scope.vmCertificateProduct.queryParams.page = vmCertificateProduct.table.page();
			$state.go('.',$scope.vmCertificateProduct.queryParams);
		}, $scope, vmCertificateProduct.table);

		function getData() {
			const id = $stateParams.id;
			bzResourceSvc.api($window.settings.services.admin + '/certificate-product' + '/:id')
			.get( vmCertificateProduct.queryParams ,{id:id}, function(resp){
				vmCertificateProduct.queryParams.pageCount = resp.totalPage;
				vmCertificateProduct.listProductOfCer = resp.in;
				vmCertificateProduct.listProduct = resp.nin;
				vmCertificateProduct.table = new NgTableParams({count: vmCertificateProduct.queryParams.limit || 10}, {
					counts: [],
					getData: function(params) {
						params.total(resp.totalItems);
						return vmCertificateProduct.listProductOfCer;
					}
				});
				vmCertificateProduct.table.page(vmCertificateProduct.queryParams.page);
				vmCertificateProduct.loading = false;
			});
		}

		function getCertificate(){
            const id = $stateParams.id;
            certificateSvc.get(id).then(function(res){
                vmCertificateProduct.certificate = res;
            }).catch(function (err){
                 $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Getting',
                            message: err.data.message
                        }
                    });
            });
        };

		

		
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

		

		function sort(id, value){
			$bzPopup.toastr({
				type: 'success',
				data:{
					title: 'Cập nhật',
					message: 'Cập nhật thứ tự chứng chỉ thành công!'
				}
			});
		}


		function addCertificateProduct(isValid) {
			vmCertificateProduct.submitted = true;
			vmCertificateProduct.lockForm = true;
			if (isValid) {
				for(var i = 0; i< vmCertificateProduct.productID.length; i++) {
					let id_product = vmCertificateProduct.productID[i];

					tagSvc.getProductById(id_product).then(function (resp) {
					var product = resp;
					product.certificates.push(vmCertificateProduct.cerID);
					productSvc.updateProduct({ data: product },id_product).then(function (resp) {
						$bzPopup.toastr({
							type: 'success',
							data: {
								title: 'Sản phẩm',
								message: 'thêm vào nhãn thành công'
							}
						});
						$state.reload();
					}).catch(function (error) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'aaa',
								message: error.data.message
							}
						});
					});

				});

				}
				
			}
			else {
				vmCertificateProduct.submitted = true;
				vmCertificateProduct.lockForm = false;
			}
		}

		function delCertificateProduct(id_product) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa';
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
					$scope.ok = function () {
						tagSvc.getProductById(id_product).then(function (resp) {
							var product = resp;

							// Tìm vị trí và xóa tag trong product
							var index = 0;
							var p = product.certificates.find(function (item, key) {
								index = key;
								return item == vmCertificateProduct.cerID;
							});
							product.certificates.splice(index, 1);
							
							// Cập nhập lại product
							productSvc.updateProduct({ data: product },id_product).then(function (resp) {
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Sản phẩm',
										message: 'Xóa sản phẩm thành công'
									}
								});
								$state.reload();
								$uibModalInstance.close();
							}).catch(function (error) {
								$bzPopup.toastr({
									type: 'error',
									data: {
										title: 'Xóa sản phẩm thất bại',
										message: error.data.message
									}
								});
							});
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