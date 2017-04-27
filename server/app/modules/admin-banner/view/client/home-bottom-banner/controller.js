var bannerHomeBottomCtrl = (function () {
	'use strict';

	angular
		.module('bzBanner')
		.controller('bannerHomeBottomCtrl', bannerHomeBottomCtrl);

	function bannerHomeBottomCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, bannerSvc, Upload) {
		var vmBaHB = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('banner', ['add', 'edit'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmBaHB.loading = true;
		vmBaHB.urlImg = settingJs.configs.uploadDirectory.banner;

		// Methods
		vmBaHB.uploadImage = uploadImage;
		vmBaHB.enableForm = enableForm;
		vmBaHB.showAddFrm = showAddFrm;
		vmBaHB.del = del;
		vmBaHB.create = create;
		vmBaHB.update = update;

		// Init
		getData();


		/*FUNCTION*/
		function getData() {
			bannerSvc.getAll({ page: 'home', position: 'bottom', type: 'item' }).then(function (resp) {
				vmBaHB.banList = resp.data;
				vmBaHB.banAdd = initBanner('item', 'banAdd');
				vmBaHB.loading = false;
			})
		}

		function initBanner(type, name) {
			var banner = {
				show_add: false,
				name: name,
				data: {
					page: 'home',
					position: 'bottom',
					type: type,
					order: 1,
					status: true,
					style: '1'
				}
			};
			return banner;
		}

		function enableForm(form) {
			form.$submitted = false;
		}

		function showAddFrm(banner) {
			banner.show_add = !banner.show_add;
			return;
		}

		function uploadImage(file, banner, form, update_banner) {
			if (file.length > 0) {
				if (file[0].type == "image/png" || file[0].type == "image/jpeg") {
					Upload.upload({
						url: $window.settings.services.uploadApi + '/upload/file',
						data: {
							file: file[0],
							type: 'banner_image',
							prefix: 'banner_image',
						}
					}).then(function (resp) {
						if (!banner.imgsDel) banner.imgsDel = [];
						if (banner.image) banner.imgsDel.push(banner.image);
						banner.image = resp.data.filename;
						form.$submitted = false;
						if (update_banner) {
							update(form, banner, banner._id);
						}
						else {
							$bzPopup.toastr({
								type: 'success',
								data: {
									title: 'Thành công!',
									message: 'Upload ảnh thành công!'
								}
							});
						}
					}, function (resp) {
						$bzPopup.toastr({
							type: 'error',
							data: {
								title: 'Lỗi!',
								message: 'Upload ảnh Lỗi!'
							}
						});
					});
				}
				else {
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Lỗi!',
							message: 'Hình ảnh phải có định dạng png hoặc jpg!'
						}
					});
					return;
				}
			}
		}

		function create(form, banner, bannerList, type) {
			if (!banner.data.image) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng upload hình ảnh!'
					}
				});
				return;
			}
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng điền đầy đủ thông tin!'
					}
				});
				return;
			}
			bannerSvc.create({ data: banner.data }).then(function (resp) {
				bannerList.push(resp.data);
				vmBaHB[banner.name] = initBanner(type, banner.name);
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Thêm banner thành công!'
					}
				}).catch(function (error) {
					form.$submitted = false;
					console.log(error);
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Lỗi!',
							message: 'Thêm banner thất bại. Hãy thử lại!'
						}
					});
				});;
			})
		}

		function update(form, banner, id) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng điền đầy đủ thông tin!'
					}
				});
				return;
			}
			bannerSvc.update({ data: banner }, id).then(function (resp) {
				form.$submitted = false;
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Sửa banner thành công!'
					}
				}).catch(function (error) {
					form.$submitted = false;
					console.log(error);
					$bzPopup.toastr({
						type: 'error',
						data: {
							title: 'Lỗi!',
							message: 'Sửa banner thất bại. Hãy thử lại!'
						}
					});
				});
			})
		}

		function del(key, id, bannerList) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/message/view.html',
				controller: function ($scope, $uibModalInstance) {
					$scope.popTitle = 'Xóa ';
					$scope.message = 'Bạn muốn xóa banner này?';

					$scope.ok = function () {
						bannerSvc.del(id).then(function (resp) {
							if (resp.success) {
								$uibModalInstance.close();
								bannerList.splice(key, 1);

								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Thành công!',
										message: 'Xóa banner thành công!'
									}
								});
							}
						}).catch(function (error) {
							form.$submitted = false;
							console.log(error);
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Xóa banner thất bại. Hãy thử lại!'
								}
							});
						});
					}
				}
			});
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