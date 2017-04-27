var categoryAddCtrl = (function () {
    'use strict';

    angular
        .module('bzCategory')
        .controller('categoryAddCtrl', categoryAddCtrl);

    function categoryAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal, userRoles, authSvc,
        NgTableParams, ngTableEventsChannel, bzResourceSvc, categorySvc, Upload, bzUtilsSvc) {
        /* jshint validthis: true */
        var vmcategoryAdd = this;
        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('category', ['add'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmcategoryAdd.lockFOrm = false;
        vmcategoryAdd.save = create;
        vmcategoryAdd.submitted = false;
        vmcategoryAdd.uploadImage = uploadImage;
        vmcategoryAdd.removeImage = removeImage;
        vmcategoryAdd.generatorSlug = generatorSlug;
        vmcategoryAdd.parrentCate = {};
        // vmcategoryAdd.onSelectCategoryParrent = onSelectCategoryParrent;
        vmcategoryAdd.imagesDirectory = settingJs.configs.uploadDirectory.category;

        vmcategoryAdd.listChildCategory = [[], [], [], []];
        vmcategoryAdd.showChildCategory = [false, false, false, false];

        // Init
        getListCategory();

        // Method

        function generatorSlug(text) {
            vmcategoryAdd.formData.slug = bzUtilsSvc.textToSlug(text);
        }

        function checkExistSlug(slug) {
            return categorySvc.get(slug);
        }

       
        function getListCategory() {
            bzResourceSvc.api($window.settings.services.admin + '/category')
                .get({
                    limit: 100,
                    page: 1,
                    parrent_id: "*"
                }, function (resp) {
                    vmcategoryAdd.listCategory = resp.items;
                },
                function (err) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Lấy danh mục hiện có',
                            message: err
                        }
                    })
                });
        };

        // Init formData

        vmcategoryAdd.formData = {
            name: '',
            slug: '',
            description: '',
            images: [],
            parrent_id: $stateParams.parrentId,
            top: [],
            status: true
        };

        function sendData() {
            if (vmcategoryAdd.formData.parrent_id == "")
                vmcategoryAdd.formData.parrent_id = null;
            categorySvc.create(vmcategoryAdd.formData).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Danh mục',
                        message: 'Thêm danh mục thành công'
                    }
                });
                $state.go('categories', { parrentSlug: vmcategoryAdd.parrentCate.slug });
            }).catch(function (error) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Danh mục',
                        message: 'Tên danh mục đã tồn tại'
                    }
                });
            });
        }
        getParrentCategory();
        function getParrentCategory() {
            categorySvc.getById(vmcategoryAdd.formData.parrent_id).then(function (resp) {
                vmcategoryAdd.parrentCate = resp;
            }).catch(function (err) {
                console.log(err);
            })
        }

        function create(isValid) {
            vmcategoryAdd.submitted = true;
            vmcategoryAdd.lockForm = true;
            if (isValid) {
                checkExistSlug(vmcategoryAdd.formData.slug).then(function (resp) {
                    if (resp.status) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Không thể thêm',
                                message: 'Bạn dã nhập slug đang được sử dụng bởi danh mục khác!'
                            }
                        })
                    }
                    else {
                        sendData();
                    }

                }).catch(function (err) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Không thể thêm',
                            message: err.data.message
                        }
                    })
                });
            }
            else {
                vmcategoryAdd.submitted = true;
            }
        };
        //Remove image uploaded
        function removeImage(index) {
            vmcategoryAdd.formData.images.splice(index, 1);
        };
        // Upload image
        function uploadImage(file) {
            if (vmcategoryAdd.formData.images.length >= 5) {
                alert("Không thể thêm! Số ảnh tối đa là 5!");
                return false;
            }
            else
                if (file.length > 0 && vmcategoryAdd.formData.images.length < 5) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/upload/file',
                            data: {
                                file: file[0],
                                type: 'category_image',
                                prefix: 'category_image',
                            }
                        }).then(function (resp) {
                            vmcategoryAdd.formData.images.push({
                                url: resp.data.filename
                            });
                            $scope.progressPercentage = false;
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Thành công!',
                                    message: 'Upload file thành công!'
                                }
                            });
                        }, function (resp) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Lỗi!',
                                    message: resp.message
                                }
                            });
                        }, function (evt) {
                            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        });
                    }
                    else {
                        alert("Hỉnh ảnh phải có định dạng là jpg, png hoặc gif!");
                        return;
                    }
                }
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