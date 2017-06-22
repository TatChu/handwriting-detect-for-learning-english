var blogEditCtrl = (function () {
    'use strict';

    angular
        .module('bzBlog')
        .controller('blogEditCtrl', blogEditCtrl);

    function blogEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal, userRoles, authSvc,
        NgTableParams, ngTableEventsChannel, customResourceSrv, blogSvc, Upload, bzUtilsSvc, CKEditorOptBlog, bzUpload) {
        /* jshint validthis: true */
        var vmEditBlog = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('blog', ['edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditBlog.lockFOrm = false;
        vmEditBlog.save = update;
        vmEditBlog.submitted = false;
        vmEditBlog.uploadImage = uploadImage;
        vmEditBlog.removeImage = removeImage;
        vmEditBlog.listImgDelete = [];
        vmEditBlog.generatorSlug = generatorSlug;
        vmEditBlog.imagesDirectory = settingJs.configs.uploadDirectory.blog;
        vmEditBlog.ckeOpt = CKEditorOptBlog;
        vmEditBlog.userCurrently = authSvc.getProfile();
        vmEditBlog.slug = $stateParams.slug;

        vmEditBlog.cropImage = cropImage;

        vmEditBlog.cancel = cancel;
        // Init
        getListBlog();
        getListTag();

        // Method
        function generatorSlug(text) {
            vmEditBlog.formData.slug = bzUtilsSvc.textToSlug(text);
        }

        function getListTag() {
            blogSvc.getTagsBlog().then(function (resp) {
                if (resp.success) {
                    vmEditBlog.listTag = resp.data;
                }
            });
        }

        function checkExistSlug(slug) {
            return blogSvc.get(slug);
        }

        function getListBlog() {
            customResourceSrv.api($window.settings.services.admin + '/blog')
                .get({
                    limit: 100,
                    page: 1,
                    parrent_id: "*"
                }, function (resp) {
                    vmEditBlog.listBlog = resp.items;
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
        getData();

        // Method 
        function getData() {
            const slug = $stateParams.slug;
            blogSvc.get(slug).then(function (res) {
                vmEditBlog.formData = res;
                // console.log(res);
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Không thể tải bài viết',
                        message: err.data
                    }
                });
            });
        }
        function sendData() {
            vmEditBlog.formData.listImgDelete = vmEditBlog.listImgDelete;
            blogSvc.update(vmEditBlog.formData, vmEditBlog.slug).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Bài viết',
                        message: 'Cập nhật viết thành công'
                    }
                });
                if (resp.type == 'CS')
                    $state.go('blogsPolicy');
                else
                    if (resp.type == 'GB')
                        $state.go('blogsPost');
                    else
                        if (resp.type == 'MV')
                            $state.go('blogsTip');
                        else
                            $state.go('blogsBanner');
            }).catch(function (error) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Bài viết',
                        message: error.message
                    }
                });
            });
        }

        function update(isValid) {
            vmEditBlog.submitted = true;
            vmEditBlog.lockForm = true;
            if (isValid) {
                // slug was modified 
                if (vmEditBlog.formData.slug != $stateParams.slug) {
                    checkExistSlug(vmEditBlog.formData.slug).then(function (resp) {
                        if (resp.status) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Không thể cập nhật',
                                    message: 'Bạn đã nhập slug đang được sử dụng bởi bài viết khác!'
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
                                message: error.message
                            }
                        });
                    });
                }
                else {
                    sendData();
                }
            }
            else {
                vmEditBlog.submitted = true;
            }
        };

        //Remove image uploaded
        function removeImage(index, fileName) {
            vmEditBlog.formData.featured_image.splice(index, 1);
            vmEditBlog.listImgDelete.push({
                url: vmEditBlog.imagesDirectory,
                fileName: fileName
            });
        };

        // Upload image
        function uploadImage(file) {
            if (vmEditBlog.formData.featured_image.length >= 5) {
                alert("Không thể thêm! Số ảnh tối đa là 5!");
                return false;
            }
            else
                if (file.length > 0 && vmEditBlog.formData.featured_image.length < 5) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/upload/file',
                            data: {
                                file: file[0],
                                type: 'blog_image',
                                prefix: 'blog_image',
                            }
                        }).then(function (resp) {
                            vmEditBlog.formData.featured_image.push({
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

        function cropImage(key, url) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'assets/global/cropper/view.html',
                controller: function ($scope, $uibModalInstance) {
                    var popupScope = this;
                    $scope.popupScope = {
                        image: vmEditBlog.imagesDirectory + url,
                        event: 'crop:image',
                        ratio: 407 / 305,
                        width: 407,
                        height: 305,
                        // mimeType : 'image/jpeg'
                    };
                    $scope.$on('crop:image', function (event, image) {
                        bzUpload.uploadBase64({ directory: 'blog_image', image: image.image }).then(function (resp) {
                            var old_image = url;
                            vmEditBlog.listImgDelete.push({
                                url: vmEditBlog.imagesDirectory,
                                fileName: url
                            });
                            vmEditBlog.formData.featured_image[key].url = resp.name;
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Thành công!',
                                    message: 'Crop ảnh thành công'
                                }
                            });

                            $uibModalInstance.close();
                        }).catch(function (err) {
                            console.log('er', err);
                        });
                    });
                }
            });
        }

        function cancel() {
            if (vmEditBlog.formData.type == 'CS')
                $state.go('blogsPolicy');
            else
                if (vmEditBlog.formData.type == 'GB')
                    $state.go('blogsPost');
                else
                    if (vmEditBlog.formData.type == 'MV')
                        $state.go('blogsTip');
                    else
                        $state.go('blogsBanner');
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