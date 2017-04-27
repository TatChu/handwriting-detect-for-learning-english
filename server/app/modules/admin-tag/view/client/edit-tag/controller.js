var tagEditCtrl = (function () {
    'use strict';

    angular
        .module('bzTag')
        .controller('tagEditCtrl', tagEditCtrl);

    function tagEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, tagSvc) {
        /* jshint validthis: true */
        var vmEditTags = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('tag',['add','edit']) ))){
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditTags.lockFOrm = false;
        vmEditTags.save = update;
        vmEditTags.vmEditTags = getTag;
        vmEditTags.submitted = false;

        //Init
        getTag();

        function getTag(){
            const id = $stateParams.id;
            tagSvc.get(id).then(function(res){
                vmEditTags.formData = res;
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
            vmEditTags.submitted = true;
            vmEditTags.lockForm = true;
            // console.log(vmEditTags.formData);
            if (isValid) {
                tagSvc.update(vmEditTags.formData, vmEditTags.formData._id).then(function (resp) {
                    // console.log('success', resp);
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Phí vận chuyển',
                            message: resp.message
                        }
                    });
                $state.go('tag-list');
                }).catch(function (error) {
                    // console.log('error', error);
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Cập nhật phí vận chuyển',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmEditTags.submitted = true;
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