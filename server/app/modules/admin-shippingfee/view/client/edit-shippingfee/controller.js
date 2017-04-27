var shippingfeeEditCtrl = (function () {
    'use strict';

    angular
        .module('bzShippingFee')
        .controller('shippingfeeEditCtrl', shippingfeeEditCtrl);

    function shippingfeeEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, shippingfeeSvc) {
        /* jshint validthis: true */
        var vmEditShippingFees = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        

        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('shipping',['add','edit']) ))){
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditShippingFees.lockFOrm = false;
        vmEditShippingFees.save = update;
        vmEditShippingFees.getShippingFee = getShippingFee;
        vmEditShippingFees.submitted = false;

        //Init
        getShippingFee();

        function getShippingFee(){
            const id = $stateParams.id;
            shippingfeeSvc.get(id).then(function(res){
                vmEditShippingFees.formData = res;
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
            vmEditShippingFees.submitted = true;
            vmEditShippingFees.lockForm = true;
            if (isValid) {
                shippingfeeSvc.update(vmEditShippingFees.formData, vmEditShippingFees.formData._id).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Phí vận chuyển',
                            message: resp.message
                        }
                    });
                $state.go('shippingfee-list');
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
                vmEditShippingFees.submitted = true;
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