var tagProcesssingCtrl = (function () {
	'use strict';

	angular
		.module('bzTag')
		.controller('tagProcesssingCtrl', tagProcesssingCtrl);

	function tagProcesssingCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
		userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, tagSvc, productSvc) {
		/* jshint validthis: true */
		var vmTagProcessing = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('tag','view') ))){
            $state.go('error403');
        }
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmTagProcessing.loading = true;
		vmTagProcessing.selectedItems = [];
		vmTagProcessing.queryParams = $stateParams;

		vmTagProcessing.userRoles = userRoles;
		// console.log('test', userRoles);
		vmTagProcessing.tags = [];
		vmTagProcessing.formData = {};
		vmTagProcessing.lockFOrm = false;
		vmTagProcessing.submitted = false;
		vmTagProcessing.optionTimePicker = {
			timePicker: true,
			timePickerIncrement: 30,
			singleDatePicker: false,
			locale: {
				format: 'h:mm DD/MM/YYYY'
			}
		};


		// Methods
		// vmTagProcessing.filter = filter;
		// vmTagProcessing.filterReset = filterReset;
		// vmTagProcessing.sort = sort;
		// vmTagProcessing.getProduct = getProduct;
		vmTagProcessing.saveProduct = saveProduct;
		vmTagProcessing.deleteProduct = deleteProduct;
		vmTagProcessing.showForm = showForm;
		vmTagProcessing.findTag = findTag;
		// vmTagProcessing.remove = remove;

		// Init
		getListTag();

		// ngTableEventsChannel.onPagesChanged(function() {
		// 	$scope.vmTagProcessing.queryParams.page = vmTagProcessing.table.page();
		// 	$state.go('.',$scope.vmTagProcessing.queryParams);
		// }, $scope, vmTagProcessing.table);

		function getListTag() {
			vmTagProcessing.productByTag = [];
			bzResourceSvc.api($window.settings.services.admin + '/tag')
			.get(vmTagProcessing.queryParams, function(resp){
				vmTagProcessing.tags = resp.items;
				vmTagProcessing.tags.forEach(function (item, index) {
					let id_tag = item._id;
					let type_tag = item.type;

					//lấy list sản phẩm ko thuộc id tag đổ ra formData
					tagSvc.getListProduct(id_tag, type_tag).then(function (resp) {
						item.products = resp.data;
					});

					//lấy list sản phẩm theo id tag đổ ra table
					tagSvc.getProductByTag(id_tag, type_tag).then(function (resp) {
						item.table = resp.data;
					});
				});
			});
		}


		function saveProduct(isValid, tag) {
			vmTagProcessing.submitted = true;
			vmTagProcessing.lockForm = true;
			if (isValid) {
				var tagProduct = {
					id_tag: tag._id,
				};
				
				var idProducts = tag.formData.idProducts;
				for (var i = 0; i < idProducts.length; i++) {
					var idProduct =  idProducts[i];

					tagSvc.getProductById(idProduct).then(function (resp) {
						var product = resp;
						product.tag_processing.push(tagProduct);

						productSvc.updateTag({ data: product}).then(function (resp) {
							$bzPopup.toastr({
								type: 'success',
								data: {
									title: 'Thành công',
									message: 'Thêm nhãn thành công'
								}
							});
							$state.reload();
						}).catch(function (error) {
							console.log('error', error);
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
				vmTagProcessing.submitted = true;
			}
		}

		function deleteProduct(product, id_tag) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa';
					$scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
					$scope.ok = function () {
						// Search index tag
						var index = 0;
						var p = product.tag_processing.find(function (item, key) {
							index = key;
							return item.id_tag == id_tag;
						});
						product.tag_processing.splice(index, 1);
						productSvc.updateTag({ data: product}).then(function (resp) {
							$bzPopup.toastr({
								type: 'success',
								data: {
									title: 'Thành công',
									message: 'Thêm nhãn thành công'
								}
							});
							$state.reload();
							$uibModalInstance.close();
						}).catch(function (error) {
							console.log('error', error);
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'aaa',
									message: error.data.message
								}
							});
							$uibModalInstance.close();
						});
					};
				}
			});
		}

		function showForm(item) {
			if (typeof item.showForm == "undefined")
				item.showForm = true;
			else {
				item.showForm = !item.showForm;
			}
		}

		function findTag(id_tag, product){
			return product.tag_processing.find(function(item){
				return item.id_tag == id_tag;
			})
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