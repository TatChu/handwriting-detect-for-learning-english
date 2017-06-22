var vocabularyEditCtrl = (function () {
    'use strict';

    angular
        .module('bzVocabulary')
        .controller('vocabularyEditCtrl', vocabularyEditCtrl);

    function vocabularyEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, Upload, customResourceSrv, vocabularySvc, listClasses, listTypesWord, bzUpload, CKEditorOptVoca) {
        /* jshint validthis: true */
        var vmEditVocabularys = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('vocabulary', ['add'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditVocabularys.classes = '4';

        vmEditVocabularys.ckeOpt = CKEditorOptVoca;
        vmEditVocabularys.lockFOrm = false;
        vmEditVocabularys.save = create;
        vmEditVocabularys.submitted = false;
        vmEditVocabularys.listClasses = listClasses;
        vmEditVocabularys.listTypesWord = listTypesWord;
        vmEditVocabularys.imagesDirectory = settingJs.configs.uploadDirectory.vocabulary;
        vmEditVocabularys.listImgDelete = [];
        // Methods
        vmEditVocabularys.getUnits = getUnits;
        vmEditVocabularys.uploadImage = uploadImage;
        vmEditVocabularys.removeImage = removeImage;
        vmEditVocabularys.cropImage = cropImage;
        vmEditVocabularys.cropSentenseImg = cropSentenseImg;


        //Init
        getUnits();
        getData();


        function getData() {
            vocabularySvc.get($stateParams.id).then(function (resp) {
                vmEditVocabularys.formData = resp;
                if (!vmEditVocabularys.formData.sentense_pattern) {
                    vmEditVocabularys.formData.sentense_pattern = {};
                }
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'từ vựng',
                        message: 'Xảy ra lỗi. Thử lại sau'
                    }
                });
            })
        }

        function getUnits() {
            vocabularySvc.getUnits(vmEditVocabularys.classes).then(function (resp) {
                if (resp.success) {
                    vmEditVocabularys.listUnit = resp.data;
                }
                if (vmEditVocabularys.listUnit.length == 0) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Danh sách bài học',
                            message: 'Chưa có bài học. Hãy thêm bài học cho lớp'
                        }
                    });
                }
            }).catch(function (err) {
                vmEditVocabularys.listUnit = [];
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Danh sách bài học',
                        message: 'Xảy ra lỗi. Hãy thêm bài học trước'
                    }
                });
            })
        }

        //Remove image uploaded
        function removeImage(index) {
            vmEditVocabularys.formData.images.splice(index, 1);
        };
        // Upload image
        function uploadImage(file, feild) {
            if (vmEditVocabularys.formData.images.length >= 3) {
                alert("Không thể thêm! Số ảnh tối đa là 5!");
                return false;
            }
            else
                if (file.length > 0 && (vmEditVocabularys.formData.images.length < 3 || (feild != undefined && feild == 'sentense_pattern'))) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/upload/file',
                            data: {
                                file: file[0],
                                type: 'vocabulary_image',
                                prefix: 'vocabulary_image',
                            }
                        }).then(function (resp) {
                            $scope.progressPercentage = false;
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Thành công!',
                                    message: 'Upload file thành công!'
                                }
                            });
                            if (feild && feild == 'sentense_pattern') {
                                vmEditVocabularys.formData.sentense_pattern.image = resp.data.filename;
                            }
                            else {
                                vmEditVocabularys.cropImage(vmEditVocabularys.formData.images.length - 1, vmBlogAdd.formData.images[vmBlogAdd.formData.images.length - 1].url);
                                vmEditVocabularys.formData.images.push({
                                    url: resp.data.filename
                                });
                            }

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

        function create(isValid) {
            vmEditVocabularys.submitted = true;
            vmEditVocabularys.lockForm = true;
            if (isValid) {
                vocabularySvc.update(vmEditVocabularys.formData, $stateParams.id).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Từ vựng',
                            message: 'Cập nhật thành công'
                        }
                    });
                    $state.go('vocabularys');
                }).catch(function (error) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Cập nhật từ vựng',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmEditVocabularys.submitted = true;
            }
        };

        function cropSentenseImg(img_url) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'assets/global/cropper/view.html',
                controller: function ($scope, $uibModalInstance) {
                    var popupScope = this;
                    $scope.popupScope = {
                        image: vmEditVocabularys.imagesDirectory + img_url,
                        event: 'crop:image',
                        // ratio: 1 / 1,
                        // width: 100,
                        height: 100,
                        // mimeType : 'image/jpeg'
                    };
                    $scope.$on('crop:image', function (event, image) {
                        bzUpload.uploadBase64({ directory: 'vocabulary_image', image: image.image }).then(function (resp) {
                            var old_image = img_url;
                            vmEditVocabularys.listImgDelete.push({
                                url: vmEditVocabularys.imagesDirectory,
                                fileName: img_url
                            });
                            vmEditVocabularys.formData.sentense_pattern.image = resp.name;
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

        function cropImage(key, url) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'assets/global/cropper/view.html',
                controller: function ($scope, $uibModalInstance) {
                    var popupScope = this;
                    $scope.popupScope = {
                        image: vmEditVocabularys.imagesDirectory + url,
                        event: 'crop:image',
                        ratio: 1 / 1,
                        width: 100,
                        height: 100,
                        // mimeType : 'image/jpeg'
                    };
                    $scope.$on('crop:image', function (event, image) {
                        bzUpload.uploadBase64({ directory: 'vocabulary_image', image: image.image }).then(function (resp) {
                            var old_image = url;
                            vmEditVocabularys.listImgDelete.push({
                                url: vmEditVocabularys.imagesDirectory,
                                fileName: url
                            });
                            vmEditVocabularys.formData.images[key].url = resp.name;
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