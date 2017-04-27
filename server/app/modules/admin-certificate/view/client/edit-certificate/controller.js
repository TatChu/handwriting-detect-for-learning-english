var certificateEditCtrl = (function () {
    'use strict';

    angular
        .module('bzCertificate')
        .controller('certificateEditCtrl', certificateEditCtrl);

    function certificateEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, certificateSvc, Upload) {
        /* jshint validthis: true */
        var vmEditCertificates = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('certificate',['add','edit']) ))){
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditCertificates.lockFOrm = false;
        vmEditCertificates.save = update;
        vmEditCertificates.vmEditCertificates = getCertificate;
        vmEditCertificates.submitted = false;

        //Method
        vmEditCertificates.uploadImage = uploadImage;
        vmEditCertificates.removeImage = removeImage;
        vmEditCertificates.imagesDirectory = settingJs.configs.uploadDirectory.certificate;

        //Init
        getCertificate();

        function getCertificate(){
            const id = $stateParams.id;
            certificateSvc.get(id).then(function(res){
                vmEditCertificates.formData = res;
            }).catch(function (err){
                 $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Getting',
                            message: err.data.message
                        }
                    });
            });
        };

        function update(isValid) {
            vmEditCertificates.submitted = true;
            vmEditCertificates.lockForm = true;
            // console.log(vmEditCertificates.formData);
            if (isValid) {
                certificateSvc.update(vmEditCertificates.formData, vmEditCertificates.formData._id).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Chứng chỉ',
                            message: "Sửa thành công"
                        }
                    });
                $state.go('certificate-list');
                }).catch(function (error) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Cập nhật chứng chỉ',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmEditCertificates.submitted = true;
            }
        };

        //Remove image uploaded
        function removeImage(index) {
            vmEditCertificates.formData.images.splice(index, 1);
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
                            vmEditCertificates.formData.images.push({
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