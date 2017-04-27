var shippingfeeAddCtrl = (function () {
    'use strict';

    angular
        .module('bzShippingFee')
        .controller('shippingfeeAddCtrl', shippingfeeAddCtrl);

    function shippingfeeAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, shippingfeeSvc) {
        /* jshint validthis: true */
        var vmAddShippingFees = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/


        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('shipping', 'add')))) {
            $state.go('error403');
        }

        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddShippingFees.formData = {};
        vmAddShippingFees.lockFOrm = false;
        vmAddShippingFees.save = create;
        vmAddShippingFees.submitted = false;
        vmAddShippingFees.formData.type = "1";

        vmAddShippingFees.listShippingFeeInMongoDB = [];
        vmAddShippingFees.listShippingFeeDefault = [];
        vmAddShippingFees.listShippingFeeNoExitsInMongoDB = [];

        vmAddShippingFees.onChangeDistrict = onChangeDistrict;
        getListShippingFee('mongodb');

        // Method
        function onChangeDistrict() {
            if (vmAddShippingFees.formData.district) {
                vmAddShippingFees.listShippingFeeNoExitsInMongoDB.forEach(function (val) {
                    if (val.district == vmAddShippingFees.formData.district) {
                        vmAddShippingFees.formData.fee = val.fee;
                        vmAddShippingFees.formData.type = val.type + '';
                    }
                });

            }
        }

        function getListShippingFee(type) {
            // get list shipping in mongodb
            if (type == 'mongodb') {
                shippingfeeSvc.getAllNoPaging().then(function (resp) {
                    vmAddShippingFees.listShippingFeeInMongoDB = resp.items;
                    getListShippingFee('default');
                }).catch(function (err) {
                    console.log(type, err);
                })
            }
            // else default get all shiping fee config
            else {
                shippingfeeSvc.getShippingFeeDefault().then(function (resp) {
                    vmAddShippingFees.listShippingFeeDefault = resp.items;
                    vmAddShippingFees.listShippingFeeDefault.map(function (item) {
                        let exitsInMongoDB = false;
                        vmAddShippingFees.listShippingFeeInMongoDB.forEach(function (val) {
                            if (val.district == item.district) {
                                exitsInMongoDB = true;
                            }
                        });

                        if (!exitsInMongoDB) {
                            vmAddShippingFees.listShippingFeeNoExitsInMongoDB.push(item);
                        }
                    });
                }).catch(function (err) {
                    console.log('get default shipping fee', err);
                })
            }
        }

        function create(isValid) {
            vmAddShippingFees.submitted = true;
            vmAddShippingFees.lockForm = true;
            if (isValid) {
                shippingfeeSvc.create(vmAddShippingFees.formData)
                    .then(function (resp) {
                        $bzPopup.toastr({
                            type: 'success',
                            data: {
                                title: 'Giá vận chuyển',
                                message: 'Thêm thành công'
                            }
                        });
                        $state.go('shippingfee-list');
                    }).catch(function (error) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Thêm giá vận chuyển',
                                message: error.data.message
                            }
                        });
                    });
            }
            else {
                vmAddShippingFees.submitted = true;
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