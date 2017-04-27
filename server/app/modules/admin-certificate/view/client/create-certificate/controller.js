var certificateAddCtrl = (function () {
    'use strict';

    angular
        .module('bzCertificate')
        .controller('certificateAddCtrl', certificateAddCtrl);

    function certificateAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, certificateSvc, Upload) {
        /* jshint validthis: true */
        var vmAddCertificates = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('certificate','add') ))){
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddCertificates.formData = {};
        vmAddCertificates.lockFOrm = false;
        vmAddCertificates.save = create;
        vmAddCertificates.submitted = false;
        vmAddCertificates.imagesDirectory = settingJs.configs.uploadDirectory.certificate;
        vmAddCertificates.formData = {
            name: '',
            description: '',
            images: [],
        };
        

        // Method
        vmAddCertificates.removeImage = removeImage;
        vmAddCertificates.uploadImage = uploadImage

        //Init

        function create(isValid) {
            vmAddCertificates.submitted = true;
            vmAddCertificates.lockForm = true;
            console.log(vmAddCertificates.formData);
            if (isValid) {
                certificateSvc.create(vmAddCertificates.formData)
                .then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Chứng chỉ ',
                            message: 'Thêm thành công'
                        }
                    });
                $state.go('certificate-list');
                }).catch(function (error) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Thêm chứng chỉ ',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmAddCertificates.submitted = true;
            }
        };

        //Remove image uploaded
        function removeImage(index) {
            vmAddCertificates.formData.images.splice(index, 1);
        };

        // Upload image
        function uploadImage(file) {
                if (file.length > 0) {
                    if (file[0].type == "image/png" || file[0].type == "image/jpeg" || file[0].type == "image/gif") {
                        Upload.upload({
                            url: $window.settings.services.uploadApi + '/upload/file',
                            data: {
                                file: file[0],
                                type: 'certificate_image',
                                prefix: 'certificate_image',
                            }
                        }).then(function (resp) {
                            vmAddCertificates.formData.images.push({
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