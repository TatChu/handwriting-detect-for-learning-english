var unitsCtrl = (function () {
    'use strict';

    angular
        .module('bzSupplier')
        .controller('supplierAddCtrl', supplierAddCtrl);

    function supplierAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, supplierSvc) {
        /* jshint validthis: true */
        var vmsupplierAdd = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('supplier', ['add'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmsupplierAdd.formData = {
            name: '',
            phone: '',
            // fax: '',
            tax_code: '',
            bank_info: {
                name: '',
                account_number: '',
                bank_name: ''
            },
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
        vmsupplierAdd.lockFOrm = false;
        vmsupplierAdd.save = create;
        vmsupplierAdd.submitted = false;

        //Init

        function create(isValid) {
            vmsupplierAdd.submitted = true;
            vmsupplierAdd.lockForm = true;
            if (isValid) {
                supplierSvc.create(vmsupplierAdd.formData).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Nhà cung cấp',
                            message: resp.message
                        }
                    });
                    $state.go('suppliers');
                }).catch(function (error) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Nhà cung cấp',
                            message: error.data.message
                        }
                    });
                    vmsupplierAdd.submitted = true;
                    vmsupplierAdd.lockForm = false;
                });
            }
            else {
                vmsupplierAdd.submitted = true;
                vmsupplierAdd.lockForm = false;
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