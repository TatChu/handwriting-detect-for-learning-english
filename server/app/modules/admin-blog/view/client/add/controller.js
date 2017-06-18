var blogAddCtrl = (function () {
    'use strict';

    angular
        .module('bzBlog')
        .controller('blogAddCtrl', blogAddCtrl);

    function blogAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal, userRoles, authSvc,
        NgTableParams, ngTableEventsChannel, customResourceSrv, blogSvc, Upload, bzUtilsSvc, CKEditorOptBlog, bzUpload) {
        /* jshint validthis: true */
        var vmBlogAdd = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('blog', ['add'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmBlogAdd.lockFOrm = false;
        vmBlogAdd.save = create;
        vmBlogAdd.submitted = false;
        vmBlogAdd.uploadImage = uploadImage;
        vmBlogAdd.removeImage = removeImage;
        vmBlogAdd.listImgDelete = [];
        vmBlogAdd.listTag = [];
        vmBlogAdd.generatorSlug = generatorSlug;
        vmBlogAdd.imagesDirectory = settingJs.configs.uploadDirectory.blog;
        vmBlogAdd.ckeOpt = CKEditorOptBlog;
        vmBlogAdd.userCurrently = authSvc.getProfile();
        vmBlogAdd.cropImage = cropImage;

        vmBlogAdd.cancel = cancel;
        // Init
        getListBlog();
        getListTag();


        // Method
        function generatorSlug(text) {
            vmBlogAdd.formData.slug = bzUtilsSvc.textToSlug(text);
        }

        function getListTag() {
            blogSvc.getTagsBlog().then(function (resp) {
                if (resp.success) {
                    vmBlogAdd.listTag = resp.data;
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
                    vmBlogAdd.listBlog = resp.items;
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
        vmBlogAdd.formData = {
            name: '',
            slug: '',
            type: $stateParams.type,
            meta_title: '',
            meta_keywords: '',
            meta_description: '',
            short_description: '',
            content: '',
            auth_id: vmBlogAdd.userCurrently.uid,
            featured_image: [],
            tags: [],
            status: true
        };

        function sendData() {
            vmBlogAdd.formData.listImgDelete = vmBlogAdd.listImgDelete;
            blogSvc.create(vmBlogAdd.formData).then(function (resp) {
                $bzPopup.toastr({
                    type: 'success',
                    data: {
                        title: 'Bài viết',
                        message: 'Thêm bài viết thành công'
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
                        title: 'Không thể thêm',
                        message: error.data.message
                    }
                });
            });
        }

        function create(isValid) {
            vmBlogAdd.submitted = true;
            vmBlogAdd.lockForm = true;
            if (isValid) {
                checkExistSlug(vmBlogAdd.formData.slug).then(function (resp) {
                    if (resp.slug == vmBlogAdd.formData.slug) {
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
                }).catch(function (err) { // check by slug not found
                    sendData();
                });
            }
            else {
                vmBlogAdd.submitted = true;
            }
        };
        //Remove image uploaded
        function removeImage(index, fileName) {
            vmBlogAdd.formData.featured_image.splice(index, 1);
            vmBlogAdd.listImgDelete.push({
                url: vmBlogAdd.imagesDirectory,
                fileName: fileName
            });
        };

        // Upload image
        function uploadImage(file) {
            if (vmBlogAdd.formData.featured_image.length >= 5) {
                alert("Không thể thêm! Số ảnh tối đa là 5!");
                return false;
            }
            else
                if (file.length > 0 && vmBlogAdd.formData.featured_image.length < 5) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/upload/file',
                            data: {
                                file: file[0],
                                type: 'blog_image',
                                prefix: 'blog_image',
                            }
                        }).then(function (resp) {
                            vmBlogAdd.formData.featured_image.push({
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
                            cropImage(vmBlogAdd.formData.featured_image.length - 1, vmBlogAdd.formData.featured_image[vmBlogAdd.formData.featured_image.length - 1].url);
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
                        image: vmBlogAdd.imagesDirectory + url,
                        event: 'crop:image',
                        ratio: 407 / 305,
                        width: 407,
                        height: 305,
                        // mimeType : 'image/jpeg'
                    };
                    $scope.$on('crop:image', function (event, image) {
                        bzUpload.uploadBase64({ directory: 'blog_image', image: image.image }).then(function (resp) {
                            var old_image = url;
                            vmBlogAdd.listImgDelete.push({
                                url: vmBlogAdd.imagesDirectory,
                                fileName: url
                            });
                            vmBlogAdd.formData.featured_image[key].url = resp.name;
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
            if ($stateParams.type == 'CS')
                $state.go('blogsPolicy');
            else
                if ($stateParams.type == 'GB')
                    $state.go('blogsPost');
                else
                    if ($stateParams.type == 'MV')
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