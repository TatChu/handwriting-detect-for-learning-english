var couponAddCtrl = (function () {
    'use strict';

    angular
        .module('bzCoupon')
        .controller('couponAddCtrl', couponAddCtrl);

    function couponAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, couponSvc, shippingfeeSvc, categorySvc) {
        /* jshint validthis: true */
        var vmAddCoupons = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('coupon', 'add')))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddCoupons.formData = {};
        vmAddCoupons.lockForm = false;
        vmAddCoupons.submitted = false;
        vmAddCoupons.formData.status = "active";
        vmAddCoupons.tmp_count = "0";
        vmAddCoupons.tmp_sale = "money";
        vmAddCoupons.formData.sale = {};
        vmAddCoupons.formData.sale.is_money = true;
        vmAddCoupons.formData.sale.is_percent = false;
        vmAddCoupons.formData.sale.percent_value = "";
        vmAddCoupons.formData.sale.money_value = "";
        vmAddCoupons.optionTimePicker = {
            timePicker: true,
            timePickerIncrement: 30,
            locale: {
                format: 'h:mm DD/MM/YYYY'
            }
        };

        // Methods
        vmAddCoupons.upCase = upCase;
        vmAddCoupons.save = create;
        vmAddCoupons.randomString = randomString;
        vmAddCoupons.checkSale = checkSale;
        vmAddCoupons.addManyCoupon = addManyCoupon;

        // Init
        getDistrict();
        getListCategory();

        function getDistrict() {
            shippingfeeSvc.getAllNoPaging().then(function (resp) {
                vmAddCoupons.district = resp.items;
                // console.log('district', vmAddCoupons.district);
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Thêm phiếu mua hàng',
                        message: 'Lỗi server'
                    }
                });
            });
        }

        function getListCategory() {
            bzResourceSvc.api($window.settings.services.admin + '/category')
                .get({
                    limit: 100,
                    page: 1,
                    parrent_id: "*"
                }, function (resp) {
                    vmAddCoupons.listCategory = resp.items;
                });
        };

        function upCase() {
            vmAddCoupons.formData.code = vmAddCoupons.formData.code.toUpperCase();
        }

        function create(isValid) {
            vmAddCoupons.submitted = true;
            vmAddCoupons.lockForm = true;
            vmAddCoupons.formData.count = vmAddCoupons.tmp_count == "1" ? true : false;
            if (isValid) {
                let arr_code = vmAddCoupons.formData.code.split(',');
                let codeDuplicate = -1;

                let checkDuplicate = function (i, done) {
                    if (i >= arr_code.length) {
                        done();
                    }
                    else {
                        let code = arr_code[i];
                        if (code != '') {
                            couponSvc.getByCode(code).then(function (resp) {
                                if (resp.success) {
                                    codeDuplicate = i;
                                    done();
                                }
                                else checkDuplicate(++i, done);
                            }).catch(function (err) {
                                console.log(err);
                                checkDuplicate(++i, done);
                            })
                        }
                        else checkDuplicate(++i, done);
                    }
                }
                checkDuplicate(0, function () {
                    if (codeDuplicate != -1) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Thêm phiếu mua hàng',
                                message: 'Đã tồn tại mã ' + arr_code[codeDuplicate]
                            }
                        });
                        vmAddCoupons.lockForm = false;
                    }
                    else {
                        couponSvc.create(vmAddCoupons.formData).then(function (resp) {
                            $bzPopup.toastr({
                                type: 'success',
                                data: {
                                    title: 'Thành công',
                                    message: resp.message
                                }
                            });
                            $state.go('coupon-list');
                        }).catch(function (error) {
                            console.log(1, error);
                            vmAddCoupons.lockForm = false;
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Thêm phiếu mua hàng',
                                    message: error.data.message
                                }
                            });
                        });
                    }
                })
            }
            else {
                vmAddCoupons.submitted = true;
                vmAddCoupons.lockForm = false;
            }
        };



        function randomString() {
            var length = 5;
            var chars = '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i) {
                result += chars[Math.round(Math.random() * (chars.length - 1))];
            }
            vmAddCoupons.formData.code = result;
        }

        function checkSale() {
            if (vmAddCoupons.tmp_sale === "money") {
                vmAddCoupons.formData.sale.is_money = true;
                vmAddCoupons.formData.sale.is_percent = false;
                vmAddCoupons.formData.sale.percent_value = "";
            }
            else {
                vmAddCoupons.formData.sale.is_money = false;
                vmAddCoupons.formData.sale.is_percent = true;
                vmAddCoupons.formData.sale.money_value = "";
            }
        }

        function addManyCoupon() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/admin-coupon/view/client/popup/add-many-coupon/add-many-coupon.html',
                controller: 'popupGenaratorCodeCtrl',
                resolve: {
                    data: function () {
                        return angular.copy({});
                    }
                }
            });

            modalInstance.result.then(function (resp) {
                vmAddCoupons.formData.code = resp;
            }, function () {
            });
        }


        //End Ctrl
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