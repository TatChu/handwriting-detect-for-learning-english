var productEditCtrl = (function () {
	'use strict';

	angular
		.module('bzProduct')
		.controller('productEditCtrl', productEditCtrl);

	function productEditCtrl($scope, $state, $stateParams, $bzPopup, $window, $timeout, $uibModal,
		authSvc, productSvc, Upload, CKEditorOptPro, statusProduct) {
		var vmPrE = this;

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('product', ['add', 'edit'])))) {
			$state.go('error403');
		}
		/*END XÉT QUYỀN TRUY CẬP ROUTER*/
		// Vars
		vmPrE.queryParams = $stateParams;
		vmPrE.loading = true;
		vmPrE.urlImg = settingJs.configs.uploadDirectory.product;
		vmPrE.ckeOpt = CKEditorOptPro;
		vmPrE.statusProduct = statusProduct;

		// Methods
		vmPrE.submitForm = submitForm;
		vmPrE.getNameTag = getNameTag;
		vmPrE.uploadImage = uploadImage;
		vmPrE.removeRelated = removeRelated;
		vmPrE.changeStatus = changeStatus;
		vmPrE.removeDisabled = removeDisabled;
		vmPrE.removeImage = removeImage;
		vmPrE.addTagProccess = addTagProccess;
		vmPrE.checkSlug = checkSlug;
		vmPrE.cropImage = cropImage;
		vmPrE.selectThumb = selectThumb;
		vmPrE.checkImgOld = productSvc.checkImgOld;
		vmPrE.checkActiveOnsale = checkActiveOnsale;
		vmPrE.fixImgProductDetail = productSvc.fixImgProductDetail;

		// Init
		getData();

		/*FUNCTION*/
		function getData() {
			productSvc.getProductByID(vmPrE.queryParams.id).then(function (resp) {
				vmPrE.productTmp = {};
				vmPrE.optionsCate = formatCategory(resp.categoryWithSub);
				vmPrE.unitList = resp.unit;
				vmPrE.product = resp.product;
				vmPrE.product.videos = resp.product.videos ? resp.product.videos : [];
				vmPrE.product.video = resp.product.videos.length > 0 ? resp.product.videos[0].url : '';
				if (vmPrE.product.thumb) {
					vmPrE.productTmp.thumb = productSvc.thumbToImage(vmPrE.product.thumb);
				}

				vmPrE.categoryList = resp.categoryList;
				vmPrE.promotionList = resp.promotionList;
				vmPrE.certificateList = resp.certificateList;
				vmPrE.tags_proccess = resp.tags_proccess;
				vmPrE.tmp_tag_proccessing = vmPrE.product.tag_processing.map(function (item) {
					return item.id_tag;
				})

				// Start: Datetime picker
				var dateTimePickerOpt = {
					singleDatePicker: false
				};
				var textDateTime = '';
				if (vmPrE.product.due_date) {
					var startDate = moment(vmPrE.product.due_date.start_date).format('DD/MM/YYYY');
					var endDate = moment(vmPrE.product.due_date.end_date).format('DD/MM/YYYY');
					angular.extend(dateTimePickerOpt, {
						startDate: startDate,
						endDate: endDate,
					});
					textDateTime = startDate + ' - ' + endDate;

				}
				vmPrE.dateTimePickerOpt = dateTimePickerOpt;
				vmPrE.showDateTime = true;
				$timeout(function () {
					angular.element('#datetime-picker').val(textDateTime);
				}, 10);
				// End: Datetime picker

				vmPrE.active_tmp = vmPrE.product.active ? '1' : '0';
				vmPrE.vat_tmp = vmPrE.product.vat ? '1' : '0';
				vmPrE.productList = resp.productList;
				vmPrE.productBalance = resp.productBalance ? resp.productBalance.value : 3;
				vmPrE.imgDelete = [];
				vmPrE.product.detail_infor = productSvc.fixImgProductDetail(vmPrE.product.detail_infor);
				getNameTag();
				vmPrE.loading = false;
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

		function changeStatus() {
			if (vmPrE.product.qty_in_stock < vmPrE.productBalance) {
				vmPrE.product.status = 'SHH';
				return;
			}
			if (vmPrE.product.qty_in_stock >= vmPrE.productBalance) {
				vmPrE.product.status = 'CH';
				return;
			}
		}

		function getNameTag() {
			vmPrE.units_name = vmPrE.unitList.find(function (item) {
				return vmPrE.product.id_unit === item._id
			});
		}

		function removeRelated(value) {
			var index = vmPrE.product.relative_product.indexOf(value._id);
			if (index > -1) {
				vmPrE.product.relative_product.splice(index, 1);
				// Start: Fix element not remove in select2
				$timeout(function () {
					var ele = $('#mod-product-edit .content .select2-search-choice:contains("' + value.name + '")');
					ele.find('.select2-search-choice-close').trigger('click');
				}, 10);
				// End: Fix element not remove in select2
			}
		}

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
								vmPrE.product.images.push({
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
								$bzPopup.toastr({
									type: 'error',
									data: {
										title: 'Lỗi!',
										message: 'Upload ảnh lỗi!'
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

		function checkSlug(text) {
			vmPrE.product.slug = productSvc.changeToSlug(text);
		}

		function submitForm(form) {
			if (!form.$valid) {
				$bzPopup.toastr({
					type: 'error',
					data: {
						title: 'Lỗi!',
						message: 'Vui lòng nhập đầy đủ thông tin.'
					}
				});
				return;
			}

			vmPrE.product.active = vmPrE.active_tmp == '1' ? true : false;
			vmPrE.product.vat = vmPrE.vat_tmp == '1' ? true : false;
			if (vmPrE.productTmp.due_date) {
				vmPrE.product.due_date = {
					start_date: vmPrE.productTmp.due_date.startDate,
					end_date: vmPrE.productTmp.due_date.endDate
				};
			}

			if (vmPrE.product.video) {
				vmPrE.product.video = productSvc.formatYoutube(vmPrE.product.video);

				vmPrE.product.videos = [{
					url: vmPrE.product.video
				}];
				delete vmPrE.product.video;
			}

			if (vmPrE.productTmp.thumb) {
				if (productSvc.imageToThumb(vmPrE.productTmp.thumb) != vmPrE.product.thumb) {
					vmPrE.product.thumb = vmPrE.productTmp.thumb;
				}
			}

			productSvc.updateProduct({
				data: vmPrE.product,
				imgDelete: vmPrE.imgDelete
			}, vmPrE.product._id).then(function (resp) {
				if (resp.success == true) {
					$state.go("product");
					$bzPopup.toastr({
						type: 'success',
						data: {
							title: 'Thành công!',
							message: 'Sửa sản phẩm thành công!'
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
						message: 'Sửa sản phẩm thất bại. Hãy thử lại'
					}
				});
			});
		}

		function removeImage(key, url, fileName) {
			vmPrE.imgDelete.push({
				url: url,
				fileName: fileName
			});
			vmPrE.product.images.splice(key, 1);
		}

		function removeDisabled(form) {
			if (form) {
				form.$submitted = false;
			}
		}

		function addTagProccess(tmp_tag_proccess) {
			if (tmp_tag_proccess) {
				vmPrE.product.tag_processing = tmp_tag_proccess.map(function (item) {
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
						image: vmPrE.urlImg + image_product.url,
						event: 'crop:image',
						ratio: 1,
						width: 500,
						height: 500,
					};
					$scope.$on('crop:image', function (event, image) {
						productSvc.uploadBase64({ directory: 'product_image', image: image.image }).then(function (resp) {
							var old_image = image_product.url;
							vmPrE.imgDelete.push({
								url: vmPrE.urlImg,
								fileName: image_product.url
							});
							vmPrE.product.images[key].url = resp.name;
							if (vmPrE.productTmp.thumb == old_image) {
								selectThumb(key);
							}
							$uibModalInstance.close();
						});
					});
				}
			});
		}

		function selectThumb(key) {
			vmPrE.productTmp.thumb = vmPrE.product.images[key].url;
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