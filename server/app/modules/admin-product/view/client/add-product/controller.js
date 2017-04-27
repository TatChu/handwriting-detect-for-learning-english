var productAddCtrl = (function () {
	'use strict';

	angular
		.module('bzProduct')
		.controller('productAddCtrl', productAddCtrl);

	function productAddCtrl($scope, $state, $stateParams, $bzPopup, $window, $timeout, $uibModal,
		authSvc, productSvc, Upload, CKEditorOptPro, statusProduct) {
		var vmPrA = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('product', 'add')))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmPrA.loading = true;
		vmPrA.queryParams = $stateParams;
		vmPrA.urlUploadImg = settingJs.configs.uploadDirectory.product;
		vmPrA.ckeOpt = CKEditorOptPro;
		vmPrA.statusProduct = statusProduct;
		vmPrA.dateTimePickerOpt = {
			singleDatePicker: false
		};

		// Methods
		vmPrA.addProduct = addProduct;
		vmPrA.getNameTag = getNameTag;
		vmPrA.uploadImage = uploadImage;
		vmPrA.removeProductRelated = removeProductRelated;
		vmPrA.changeStatusProduct = changeStatusProduct;
		vmPrA.removeDisabledSubmit = removeDisabledSubmit;
		vmPrA.removeImage = removeImage;
		vmPrA.addTagProccess = addTagProccess;
		vmPrA.checkSlug = checkSlug;
		vmPrA.cropImage = cropImage;
		vmPrA.selectThumb = selectThumb;
		vmPrA.checkImgOld = productSvc.checkImgOld;
		vmPrA.checkActiveOnsale = checkActiveOnsale;

		// Init
		getData();

		/*FUNCTION*/
		// Start: Create default data
		function getData() {
			productSvc.add().then(function (resp) {
				vmPrA.optionsCate = formatCategory(resp.categoryWithSub);
				vmPrA.relatedProduct = [];
				vmPrA.unitList = resp.unit;
				vmPrA.productList = resp.productList;
				vmPrA.categoryList = resp.categoryList;
				vmPrA.promotionList = resp.promotionList;
				vmPrA.certificateList = resp.certificateList;
				vmPrA.tags_proccess = resp.tags_proccess;

				vmPrA.active_tmp = '1';
				vmPrA.vat_tmp = '1';
				vmPrA.productTmp = {};
				angular.element('#datetime-picker').val('');
				vmPrA.productBalance = resp.productBalance ? resp.productBalance.value : 3;
				vmPrA.product = {
					active: true,
					slug: '',
					videos: [],
					status: 'HSV',
					images: [],
					relative_product: [],
					other_is: false,
					id_unit: null,
					qty_in_stock: 0
				};
				vmPrA.loading = false;
				vmPrA.imgDelete = [];

				// Sync category select2
				$timeout(function () {
					var ele = $('#mod-product-add .content .select2-search-choice');
					ele.find('.select2-search-choice-close').trigger('click');
				}, 10);
				getNameTag();
			}).catch(function (error) {
				console.log(error);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Có vấn đề! Hãy thử tải lại trang.'
					}
				});
			});
		}
		// End: Create default data


		function checkSlug(text) {
			vmPrA.product.slug = productSvc.changeToSlug(text);
		}

		function formatCategory(categories) {
			var options = [];
			var createSub = function (category, cates) {
				cates.push(category);
				if (category.sub_category && category.sub_category.length > 0) {
					category.sub_category.forEach(function (sub) {
						return createSub(sub, cates);
					})
				}
				return cates;
			}

			categories.forEach(function (category) {
				var array = createSub(category, []);
				category.sub_cate = array.splice(1);
				options.push(category);
			})
			return options;
		}

		// Set auto status product
		function changeStatusProduct() {
			if (vmPrA.product.qty_in_stock < vmPrA.productBalance) {
				vmPrA.product.status = 'SHH';
				return;
			}
			if (vmPrA.product.qty_in_stock >= vmPrA.productBalance) {
				vmPrA.product.status = 'CH';
				return;
			}
		}

		// Search name tag by ID
		function getNameTag() {
			vmPrA.units_name = vmPrA.unitList.find(function (item) {
				return vmPrA.product.id_unit === item._id
			});
		}

		// Remove related product
		function removeProductRelated(value) {
			var index = vmPrA.product.relative_product.indexOf(value._id);
			if (index > -1) {
				vmPrA.product.relative_product.splice(index, 1);

				// Start: Fix sync element not remove in select2
				$timeout(function () {
					var ele = $('#mod-product-add .content .select2-search-choice:contains("' + value.name + '")');
					ele.find('.select2-search-choice-close').trigger('click');
				}, 10);
				// End: Fix sync element not remove in select2
			}
		}

		// Upload image product
		function uploadImage(file) {
			if (file.length > 0) {
				if (file[0].type == "image/png" || file[0].type == "image/jpeg") {
					Upload.imageDimensions(file[0]).then(function (dimensions) {
						if (dimensions.width > 448 && dimensions.height > 448) {
							Upload.upload({
								url: $window.settings.services.uploadApi + '/upload/file',
								data: {
									file: file[0],
									type: 'product_image',
									prefix: 'product_image',
								}
							}).then(function (resp) {
								vmPrA.product.images.push({
									url: resp.data.filename
								});
								$scope.progressPercentage = false;
								$bzPopup.toastr({
									type: 'success',
									data: {
										title: 'Thành công!',
										message: 'Upload ảnh thành công!'
									}
								});
							}, function (resp) {
								$scope.progressPercentage = false;
								$bzPopup.toastr({
									type: 'error',
									data: {
										title: 'Lỗi!',
										message: 'Upload ảnh Lỗi!'
									}
								});
							}, function (evt) {
								$scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
							});
						}
						else {
							$bzPopup.toastr({
								type: 'error',
								data: {
									title: 'Lỗi!',
									message: 'Hình ảnh phải có kích thước lớn hơn 448px x 448px!'
								}
							});
						}
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

		// Submit add product
		function addProduct(form) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng điền đầy đủ thông tin.'
					}
				});
				return;
			};
			vmPrA.product.active = vmPrA.active_tmp == '1' ? true : false;
			if (vmPrA.productTmp.due_date) {
				vmPrA.product.due_date = {
					start_date: vmPrA.productTmp.due_date.startDate,
					end_date: vmPrA.productTmp.due_date.endDate
				};
			}

			if (vmPrA.product.video) {
				vmPrA.product.video = productSvc.formatYoutube(vmPrA.product.video);
				vmPrA.product.videos.push({
					url: vmPrA.product.video
				});
				delete vmPrA.product.video;
			}

			if (vmPrA.productTmp.thumb) {
				vmPrA.product.thumb = vmPrA.productTmp.thumb;
			}

			productSvc.create({
				data: vmPrA.product, imageDelete: vmPrA.imgDelete
			}).then(function (resp) {
				$state.go("product");
				$bzPopup.toastr({
					type: 'success',
					data: {
						title: 'Thành công!',
						message: 'Thêm sản phẩm thành công!'
					}
				});
			}).catch(function (error) {
				form.$submitted = false;
				console.log(error);
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Thêm sản phẩm thất bại. Hãy thử lại!'
					}
				});
			});
		}

		// Remove image
		function removeImage(key, url, nameFile) {
			vmPrA.product.images.splice(key, 1);
			vmPrA.imgDelete.push({
				url: url,
				fileName: fileName
			});
		}

		function removeDisabledSubmit(form) {
			if (form) form.$submitted = false;
		}

		function addTagProccess(tmp_tag_proccess) {
			if (tmp_tag_proccess) {
				vmPrA.product.tag_processing = tmp_tag_proccess.map(function (item) {
					return {
						id_tag: item
					};
				});
			}
		}

		function cropImage(key, image_product) {
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'assets/global/cropper/view.html',
				controller: function ($scope, $uibModalInstance) {
					var popupScope = this;
					$scope.popupScope = {
						image: vmPrA.urlUploadImg + image_product.url,
						event: 'crop:image',
						ratio: 1,
						width: 500,
						height: 500,
						// mimeType : 'image/jpeg'
					};
					$scope.$on('crop:image', function (event, image) {
						productSvc.uploadBase64({ directory: 'product_image', image: image.image }).then(function (resp) {
							var old_image = image_product.url;
							vmPrA.imgDelete.push({
								url: vmPrA.urlUploadImg,
								fileName: image_product.url
							});
							vmPrA.product.images[key].url = resp.name;
							if (vmPrA.productTmp.thumb == old_image) {
								selectThumb(key);
							}
							$uibModalInstance.close();
						});
						// save image tại đây
					});
				}
			});
		}

		function selectThumb(key) {
			vmPrA.productTmp.thumb = vmPrA.product.images[key].url;
		}

		function checkActiveOnsale(onsale) {
			var text = onsale.name;
			if (!onsale.status)
				text += " (Unactive)";
			return text;
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