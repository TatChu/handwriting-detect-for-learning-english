var categoryEditCtrl = (function () {
    'use strict';

    angular
        .module('bzCategory')
        .controller('categoryEditCtrl', categoryEditCtrl);

    function categoryEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, categorySvc, Upload, bzUtilsSvc) {
        /* jshint validthis: true */
        var vmcategoryEdit = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('category', ['edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmcategoryEdit.lockFOrm = false;
        vmcategoryEdit.save = update;
        vmcategoryEdit.submitted = false;
        vmcategoryEdit.id = null;
        vmcategoryEdit.slug = $stateParams.slug;
        vmcategoryEdit.uploadImage = uploadImage;
        vmcategoryEdit.removeImage = removeImage;
        vmcategoryEdit.generatorSlug = generatorSlug;
        vmcategoryEdit.imagesDirectory = settingJs.configs.uploadDirectory.category;

        vmcategoryEdit.listChildCategory = [];
        vmcategoryEdit.parrentCate = {};

        // Method
        function generatorSlug(text) {
            vmcategoryEdit.formData.slug = bzUtilsSvc.textToSlug(text);
        }

        function getChildCategory(id) {
            let promise = categorySvc.getChild({}, id);
            promise.then(function (resp) {
                vmcategoryEdit.listChildCategory = resp.items;
            }).catch(function (err) {

            });
        }

        function getParrentCategory() {
            categorySvc.getById(vmcategoryEdit.formData.parrent_id).then(function (resp) {
                vmcategoryEdit.parrentCate = resp;
            }).catch(function (err) {
                console.log(err);
            })
        }

        function getListCategory() {
            bzResourceSvc.api($window.settings.services.admin + '/category')
                .get({
                    limit: 100,
                    page: 1,
                    parrent_id: "*"
                }, function (resp) {
                    vmcategoryEdit.listCategory = resp.items;
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


        // Init data
        getCategory();
        getListCategory();

        //Remove image uploaded
        function removeImage(index) {
            vmcategoryEdit.formData.images.splice(index, 1);
        };
        // Upload image
        function uploadImage(file) {
            if (vmcategoryEdit.formData.images.length >= 5) {
                alert("Không thể thêm! Số ảnh tối đa là 5!");
                return false;
            }
            else
                if (file.length > 0 && vmcategoryEdit.formData.images.length < 5) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/upload/file',
                            data: {
                                file: file[0],
                                type: 'category_image',
                                prefix: 'category_image',
                            }
                        }).then(function (resp) {
                            vmcategoryEdit.formData.images.push({
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

        function getCategory() {
            categorySvc.get($stateParams.slug).then(function (resp) {
                vmcategoryEdit.formData = resp;
                vmcategoryEdit.id = resp._id;
                getChildCategory(vmcategoryEdit.id);
                getParrentCategory();

            }).catch(function (error) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Danh mục',
                        message: error.data.message
                    }
                });
            });
        };

        function checkExistSlug(slug) {
            return categorySvc.get(slug);
        }

        function sendData() {
            if (vmcategoryEdit.formData.parrent_id == "")
                vmcategoryEdit.formData.parrent_id = null;
            categorySvc.update(vmcategoryEdit.formData, vmcategoryEdit.id).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Danh mục',
                        message: 'Cập nhật danh mục thành công'
                    }
                });
                $state.go('categories', { parrentSlug: vmcategoryEdit.parrentCate.slug });
            }).catch(function (error) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Danh mục',
                        message: error.data.message
                    }
                });
            });
        }

        function update(isValid) {
            vmcategoryEdit.submitted = true;
            vmcategoryEdit.lockForm = true;
            if (isValid) {
                // slug was modified 
                if (vmcategoryEdit.formData.slug != $stateParams.slug) {
                    checkExistSlug(vmcategoryEdit.formData.slug).then(function (resp) {
                        if (resp.status) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Không thể cập nhật',
                                    message: 'Bạn đã nhập slug đang được sử dụng bởi danh mục khác!'
                                }
                            });
                        }
                        else {
                            sendData();
                        }
                    }).catch(function (error) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Không thể cập nhật',
                                message: error.data.message
                            }
                        });
                    });
                }
                else {
                    sendData();
                }
            }
            else {
                vmcategoryEdit.submitted = true;
            }
        };
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