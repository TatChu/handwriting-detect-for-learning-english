var unitsCtrl = (function () {
    'use strict';

    angular
        .module('bzSupplier')
        .controller('supplierEditCtrl', supplierEditCtrl);

    function supplierEditCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, supplierSvc) {
        /* jshint validthis: true */
        var vmsupplierEdit = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('supplier', ['edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmsupplierEdit.formData = {
            name: '',
            phone: '',
            fax: '',
            email: '',
            website: '',
            status: true,
            address: '',
            deputy: {
                name: '',
                phone: '',
                email: ''
            }
        };
        vmsupplierEdit.lockFOrm = false;
        vmsupplierEdit.save = update;
        vmsupplierEdit.submitted = false;

        //Init
        getSupplier();

        function getSupplier() {
            const id = $stateParams.id;
            supplierSvc.get(id).then(function (res) {
                vmsupplierEdit.formData = res;
                // console.log(res);
            }).catch(function (err) {
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
            vmsupplierEdit.submitted = true;
            vmsupplierEdit.lockForm = true;
            // console.log(vmsupplierEdit.formData);
            if (isValid) {
                supplierSvc.update(vmsupplierEdit.formData, vmsupplierEdit.formData._id).then(function (resp) {
                    // console.log('success', resp);
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Nhà cung cấp',
                            message: resp.message
                        }
                    });
                    $state.go('suppliers');
                }).catch(function (error) {
                    // console.log('error', error);
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Nhà cung cấp',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmsupplierEdit.submitted = true;
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