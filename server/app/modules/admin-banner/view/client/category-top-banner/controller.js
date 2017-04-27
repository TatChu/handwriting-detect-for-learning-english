var bannerCategoryTopCtrl = (function () {
	'use strict';

	angular
		.module('bzBanner')
		.controller('bannerCategoryTopCtrl', bannerCategoryTopCtrl);

	function bannerCategoryTopCtrl($scope, $state, $stateParams, $bzPopup, $uibModal, $window, bzResourceSvc, NgTableParams, ngTableEventsChannel, authSvc, bannerSvc, Upload) {
		var vmBaCT = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('banner', ['add', 'edit'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/

		// Vars
		vmBaCT.loading = true;
		vmBaCT.urlImg = settingJs.configs.uploadDirectory.banner;

		// Methods
		vmBaCT.uploadImage = uploadImage;
		vmBaCT.enableForm = enableForm;
		vmBaCT.showAddFrm = showAddFrm;
		// vmBaCT.del = del;
		vmBaCT.create = create;
		vmBaCT.update = update;

		// Init
		getData();


		/*FUNCTION*/
		function getData() {
			bannerSvc.getAll({ page: 'category', position: 'top', type: 'item' }).then(function (resp) {
				vmBaCT.listCategory = resp.catgegory;
				vmBaCT.banner = resp.data;
				vmBaCT.banList = initBanner('item', 'banAdd');
				vmBaCT.loading = false;
			})
		}

		function initBanner(type, name) {
			var banner_list = vmBaCT.listCategory.map(function (item) {
				var find_banner = vmBaCT.banner.find(function (banner) {
					return banner.category == item.slug;
				});
				return {
					banner: {
						name: name,
						data: find_banner ? find_banner : {
							category: item.slug,
							page: 'category',
							position: 'top',
							type: type,
							order: 1,
							status: true,
							style: '1'
						}
					},
					category: item
				}
			});
			return banner_list;
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
							update(form, { data: banner }, banner._id);
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
				banner.data = resp.data;
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
			bannerSvc.update({ data: banner.data }, id).then(function (resp) {
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