var orderWebCtrl = (function () {
    'use strict';

    angular
        .module('bzWebOrder')
        .controller('orderWebCtrl', orderWebCtrl);

    function orderWebCtrl($scope, $window, $rootScope, bzResourceSvc, orderWebSvc, orderApiSvc, $bzPopup, apiProductSvc, authSvc, $uibModal, bzUtilsSvc) {
        var vmWebOrder = this;

        // VARS
        vmWebOrder.setQuantity = setQuantity;
        vmWebOrder.deleteProductInCart = deleteProductInCart;
        vmWebOrder.deleteCart = deleteCart;

        vmWebOrder.checkCoupon = checkCoupon;
        vmWebOrder.cancelCoupon = cancelCoupon;
        vmWebOrder.applyCoupon = applyCoupon;
        vmWebOrder.onEnterCoupon = onEnterCoupon;

        vmWebOrder.onSelectShippingAddress = onSelectShippingAddress;
        vmWebOrder.showFormAddressDetails = showFormAddressDetails;
        vmWebOrder.getShippingFee = getShippingFee;
        vmWebOrder.setShippingFee = setShippingFee;

        vmWebOrder.login = login;
        vmWebOrder.showDetailProduct = showDetailProduct;
        vmWebOrder.checkDueDateProduct = checkDueDateProduct;

        vmWebOrder.sendOrder = sendOrder;

        vmWebOrder.imgThumbProductDir = settingJs.configs.uploadDirectory.thumb_product || '/files/thumb_image/product_image/';
        vmWebOrder.sendingOrder = false; // disable button 'ĐẶT HÀNG NGAY'

        vmWebOrder.openPageCheckout = openPageCheckout;
        // Default init value
        vmWebOrder.data = {
            isLogined: false,
            freeShip: 0,                // free ship for order (1) noi thanh hoac (2) ngoai thanh
            firstOrder: false,          // khuyen mai % cho don hang dau tien
            submitted: false,
            showFormAddressDetails: false,
            shipping_address: {         // thông tin giao hàng
                id: '',
                name: '',
                phone: '',
                district: '',
                address_detail: '',
                id_shipping_fee: '',
                vocative: 'Anh'
            },
            shipping_fee: 0,            // tiền shipping
            obj_shipping_fee: null,     // obj chứa thông tin nơi shipping
            vocative: '',
            delivery_time: 'CHIEU',
            payment_method: 'COD',
            coupon: {                   //
                id: null,
                error: false,
                code: '',
                hasCounpon: false,      // trạng thái order có coupon hay không
                money: 0,               // Số tiền được khuyến mãi,
                money_coupon: 0,        // biến lưu tạm từ server về
                onLoadingCoupon: false,
                coupon: null,           // obj chứa thông tin coupon
            },
            user: null,                 // user đang đăng nhập
            list_shipping_address: [],  // danh sách địa chỉ giao hàng của user
            list_shipping_fee: []       // danh sách các quận huyện
        };

        // Init
        getUser();
        getCart();
        getConfigTextOrder();
        getConfigFreeShip();
        cfOrderAffernoon();

        angular.element('#mod-checkout').removeClass('hidden');
        angular.element('#mod-card').removeClass('hidden');
        angular.element('#mod-cart-moblie').removeClass('hidden');

        // METHOD
        vmWebOrder.checkImgOld = apiProductSvc.checkImgOld;

        function getShippingFee() {
            orderWebSvc.getShippingFee().then(function (resp) {
                if (resp.success) {
                    vmWebOrder.data.list_shipping_fee = resp.data;
                    setShippingFee();
                    checkCoupon();
                }
            });

            // Tracking Facebook Pixel
            if (typeof (fbq) != 'undefined')
                fbq('track', 'InitiateCheckout');
        }

        function getShippingAddress() {
            orderWebSvc.getShippingAddressUser().then(function (resp) {
                if (resp.success) { //user was Logined

                    vmWebOrder.data.list_shipping_address = resp.list_shipping_address;

                    if (resp.list_shipping_address.length > 0) {
                        vmWebOrder.data.shipping_address.id = vmWebOrder.data.list_shipping_address[0]._id;
                        vmWebOrder.data.shipping_address.name = vmWebOrder.data.list_shipping_address[0].name;
                        vmWebOrder.data.shipping_address.phone = vmWebOrder.data.list_shipping_address[0].phone;
                        vmWebOrder.data.shipping_address.address_detail = vmWebOrder.data.list_shipping_address[0].address_detail;
                        vmWebOrder.data.shipping_address.id_shipping_fee = vmWebOrder.data.list_shipping_address[0].id_shipping_fee._id;
                        vmWebOrder.data.shipping_address.district = vmWebOrder.data.list_shipping_address[0].id_shipping_fee.district;
                        vmWebOrder.data.shipping_address.vocative = vmWebOrder.data.list_shipping_address[0].vocative;

                        // khi set thông tin giao hàng thành công. set lại thông tin giao hàng
                        setShippingFee();
                    }
                }
            });

        }

        function setShippingFee() {
            vmWebOrder.data.shipping_fee = 0;
            var flagFreeShipTemp = false;

            // Tổng tiền sau khi trừ các khuyến mãi
            var totalTemp = ($rootScope.Cart.total - vmWebOrder.data.coupon.money
                - ((vmWebOrder.data.delivery_time == 'CHIEU')
                    ? ($rootScope.promotionForOrderDeleveryOnAffternoon.type == "PC"
                        ? (($rootScope.promotionForOrderDeleveryOnAffternoon.value / 100) * $rootScope.Cart.total)
                        : $rootScope.promotionForOrderDeleveryOnAffternoon.value)
                    : 0)
                - (vmWebOrder.data.firstOrder
                    ? ($rootScope.promotionForFirstOrder.type == "MN"
                        ? $rootScope.promotionForFirstOrder.value
                        : (($rootScope.promotionForFirstOrder.value / 100) * $rootScope.Cart.total))
                    : 0));

            vmWebOrder.data.list_shipping_fee.forEach(function (item, index) {
                if ((item._id + '') == (vmWebOrder.data.shipping_address.id_shipping_fee + '')) {
                    vmWebOrder.data.shipping_address.district = item.district;
                    vmWebOrder.data.obj_shipping_fee = item;

                    vmWebOrder.data.shipping_fee = item.fee;
                    if ((item.type == 1 || item.type == '1') && totalTemp >= $rootScope.freeShipUrban.value) {
                        vmWebOrder.data.freeShip = 1;   //mien phi ship noi thanh
                        flagFreeShipTemp = true;
                        vmWebOrder.data.shipping_fee = 0;
                    }

                    if ((item.type == 2 || item.type == '2') && totalTemp >= $rootScope.freeShipSuburb.value) {
                        vmWebOrder.data.freeShip = 2;   //mien phi ship ngoai thanh
                        flagFreeShipTemp = true;
                        vmWebOrder.data.shipping_fee = 0;
                    }
                }
            });
            if (!flagFreeShipTemp) {
                vmWebOrder.data.freeShip = 0;
            }
        }


        /////////// COUPON FUNCTION ///////////
        function onEnterCoupon() {
            vmWebOrder.data.coupon.code = vmWebOrder.data.coupon.code.toUpperCase()
            cancelCoupon();
        }

        function checkCoupon() {
            if (vmWebOrder.data.coupon.code && typeof vmWebOrder.data.coupon.code == 'string') {
                vmWebOrder.data.coupon.disable = true;

                vmWebOrder.data.coupon.onLoadingCoupon = true;

                var data = {
                    shipping_address: vmWebOrder.data.shipping_address,
                    email: vmWebOrder.data.isLogined ? vmWebOrder.data.user.email : '',
                    coupon: vmWebOrder.data.coupon.code,
                    id_shipping_fee: vmWebOrder.data.shipping_address.id_shipping_fee,
                    vocative: vmWebOrder.data.vocative,
                    delivery_time: vmWebOrder.data.delivery_time,
                    payment_method: vmWebOrder.data.payment_method,
                    note: vmWebOrder.data.note
                };
                orderWebSvc.checkCoupon(data, vmWebOrder.data.coupon.code).then(function (resp) {
                    vmWebOrder.data.coupon.onLoadingCoupon = false;
                    if (resp.success) {
                        var total_temp = (($rootScope.Cart.total + vmWebOrder.data.shipping_fee) - resp.money_coupon - ((vmWebOrder.data.delivery_time == 'CHIEU') ? ($rootScope.promotionForOrderDeleveryOnAffternoon.type
                            == "PC" ? (($rootScope.promotionForOrderDeleveryOnAffternoon.value / 100) * $rootScope.Cart.total) : $rootScope.promotionForOrderDeleveryOnAffternoon.value
                        ) : 0) - (vmWebOrder.data.firstOrder ? ($rootScope.promotionForFirstOrder.type == "MN" ? $rootScope.promotionForFirstOrder.value
                            : (($rootScope.promotionForFirstOrder.value / 100) * $rootScope.Cart.total)) : 0))

                        if (total_temp <= 0) {
                            vmWebOrder.data.coupon.error = true;
                            vmWebOrder.data.coupon.message = 'Giá trị đơn hàng không đủ để áp dụng khuyến mãi';
                        } else {
                            vmWebOrder.data.coupon.coupon = resp.coupon;
                            vmWebOrder.data.coupon.money_coupon = resp.money_coupon;
                            vmWebOrder.data.coupon.error = false;


                            // apply coupon
                            applyCoupon(vmWebOrder.data.coupon.coupon);
                        }

                        // applyCoupon(resp.coupon);
                    }
                    else {
                        cancelCoupon();
                        vmWebOrder.data.coupon.error = true;
                        vmWebOrder.data.coupon.message = resp.message;
                    }
                }).catch(function (err) {
                    console.log('coupon', err);
                })
            }
        }

        function applyCoupon(coupon) {
            if (coupon) {
                vmWebOrder.data.coupon.id = coupon._id;
                vmWebOrder.data.coupon.hasCounpon = true;
                vmWebOrder.data.coupon.name = coupon.name;
                vmWebOrder.data.coupon.error = false;
                vmWebOrder.data.coupon.money = vmWebOrder.data.coupon.money_coupon;

                // re check free ship
                setShippingFee();
                // getMoneyCoupon(coupon);
            }
            else {
                vmWebOrder.data.coupon.error = true;
                vmWebOrder.data.coupon.message = 'Thao tác không đúng';
            }
        }

        function cancelCoupon() {
            vmWebOrder.data.coupon.coupon = null;
            // vmWebOrder.data.coupon.code = '';
            vmWebOrder.data.coupon.hasCounpon = false;
            vmWebOrder.data.coupon.id = null;

            vmWebOrder.data.coupon.error = false;
            vmWebOrder.data.coupon.message = null;

            vmWebOrder.data.coupon.name = '';
            vmWebOrder.data.coupon.money = 0;
            vmWebOrder.data.coupon.money_coupon = 0;
            vmWebOrder.data.coupon.disable = false;
        }

        /////////// END COUPON ///////////

        ///////////// CART /////////////
        function getCart() {
            orderApiSvc.getCart().then(function (res) {
                setShippingFee();
            }).catch(function (err) {
                console.log('err get cart', err);
            })
        }

        function sendOrder(isInValidFormInfoOrder) {
            helperJsCustom.GA('send', 'event', 'Checkout', 'ClickButtonConfirmOrder', '');
            vmWebOrder.sendingOrder = true;
            vmWebOrder.data.submitted = true;
            // Check user is click button apply coupon
            if (vmWebOrder.data.coupon.code != '' && !vmWebOrder.data.coupon.error && !vmWebOrder.data.coupon.hasCounpon) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Đặt hàng',
                        message: 'Bạn đã nhập coupon nhưng chưa áp dụng. Hãy bấm áp dụng để được khuyến mãi'
                    }
                });
                vmWebOrder.sendingOrder = false;
            }
            else
                if ($rootScope.Cart.total_quantity == 0) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Lỗi đặt hàng',
                            message: 'Bạn chưa chọn sản phẩm'
                        }
                    });
                    vmWebOrder.sendingOrder = false;
                }
                else
                    if (vmWebOrder.data.showFormAddressDetails && isInValidFormInfoOrder) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Lỗi đặt hàng',
                                message: 'Vui lòng nhập đầy đủ và đúng thông tin đơn hàng'
                            }
                        });
                        vmWebOrder.sendingOrder = false;
                    }
                    else {
                        var data = {
                            shipping_address: vmWebOrder.data.shipping_address,
                            email: vmWebOrder.data.isLogined ? vmWebOrder.data.user.email : '',
                            coupon: vmWebOrder.data.coupon.id !== null ? vmWebOrder.data.coupon.id : '',
                            id_shipping_fee: vmWebOrder.data.shipping_address.id_shipping_fee,
                            vocative: vmWebOrder.data.vocative,
                            delivery_time: vmWebOrder.data.delivery_time,
                            payment_method: vmWebOrder.data.payment_method,
                            note: vmWebOrder.data.note
                        };

                        // Lưu lại thông tin vào storage cho user chưa đăng nhập
                        if (!vmWebOrder.data.isLogined) {
                            let localData = {
                                id_user: vmWebOrder.data.user.uid,
                                email: data.email,
                                name: data.shipping_address.name,
                                phone: data.shipping_address.phone,
                                address_detail: data.shipping_address.address_detail,
                                vocative: data.shipping_address.vocative,
                                delivery_time: data.delivery_time,
                                payment_method: data.payment_method,
                                id_shipping_fee: data.id_shipping_fee
                            }
                            bzUtilsSvc.setInfoUser(localData);
                        }
                        orderWebSvc.sendOrder(data).then(function (resp) {
                            // Tracking pixel Facebook
                            if (typeof (fbq) != 'undefined')
                                fbq('track', 'Purchase', {
                                    value: resp.total_pay,
                                    currency: 'VND'
                                });

                            $window.location.href = '/dat-hang-thanh-cong/' + resp.id_order;

                            // vmWebOrder.sendingOrder = false;
                        }).catch(function (err) {
                            vmWebOrder.sendingOrder = false;
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Lỗi đặt hàng',
                                    message: err.data.message
                                }
                            });
                        })
                    }

        }

        function deleteProductInCart(id_product, index) {
            orderApiSvc.deleteProduct(id_product).then(function (resp) {
                // console.log(resp);
            }).catch(function (err) {
                console.log(err);
            })
        }

        function deleteCart() {
            orderApiSvc.orderApiSvc().then(function (resp) { }).catch(function (err) { })
        }

        function setQuantity(id_product, new_qty) {
            orderApiSvc.update('set-quantity', { product: id_product, quantity: new_qty })
                .then(function (resp) {

                    if (resp.success) {
                        cancelCoupon();     // cancel to check again
                        checkCoupon();      // check coupon again
                        setShippingFee();   // check shipping again when update quantity
                    }

                    // Fix disable button Complete Order
                    if ($rootScope.Cart.total_quantity == 0) {
                        vmWebOrder.sendingOrder = true;
                    }
                    else {
                        vmWebOrder.sendingOrder = false;
                    }
                    if (!resp.success)
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Lỗi đặt hàng',
                                message: resp.message
                            }
                        });
                }).catch(function (err) {
                    console.log('Lỗi đặt hàng', err);
                })
        }
        ///////////// END CART /////////////



        ///////////// CONFIG /////////////
        function getUser() {
            vmWebOrder.data.user = $window.user;
            getShippingAddress();
            if (vmWebOrder.data.user.uid !== '') {
                vmWebOrder.data.isLogined = true;
                checkFirtOrderOfUser();

                // remove info local stored
                bzUtilsSvc.removeInfoUser();
            }
            else {
                getInfoLocalStorage();
            }
        }

        function getConfigTextOrder() {
            bzResourceSvc.api($window.settings.services.apiUrl + '/order/config-text')
                .get({}, function (resp) {
                    $rootScope.TextOrderConfig = resp.data;
                },
                function (err) {
                    console.log('err getConfigTextOrder', err);
                });
        }

        function cfOrderAffernoon() {
            bzResourceSvc.api($window.settings.services.apiUrl + '/order/cf-order-affternoon')
                .get({}, function (resp) {
                    $rootScope.promotionForOrderDeleveryOnAffternoon = resp;
                },
                function (err) {
                    console.log('err cfOrderAffernoon', err);
                });
        }

        function getConfigFreeShip() {
            bzResourceSvc.api($window.settings.services.apiUrl + '/order/config-free-ship')
                .get({}, function (resp) {
                    $rootScope.freeShipUrban = resp.Urban;
                    $rootScope.freeShipSuburb = resp.Suburb;
                    setShippingFee(); // when get config from server success set shipping fee again
                },
                function (err) {
                    console.log('err getConfigFreeShip', err);
                });
        }

        function checkFirtOrderOfUser() {
            if (vmWebOrder.data.isLogined && vmWebOrder.data.user.uid) {
                bzResourceSvc.api($window.settings.services.apiUrl + '/order/is-first-order/' + vmWebOrder.data.user.uid)
                    .get({}, function (resp) {
                        vmWebOrder.data.firstOrder = resp.success;
                        if (vmWebOrder.data.firstOrder) {
                            $rootScope.promotionForFirstOrder = resp.config;
                        }
                    },
                    function (err) {
                        // console.log('This is not first order', err);
                    });
            }
        }

        function getInfoLocalStorage() {
            let dataStorage = bzUtilsSvc.getInfoUser();
            if (dataStorage) {
                vmWebOrder.data.shipping_address.phone = dataStorage.phone || '';
                vmWebOrder.data.shipping_address.vocative = dataStorage.vocative || '';
                vmWebOrder.data.shipping_address.district = dataStorage.district || '';
                vmWebOrder.data.shipping_address.name = dataStorage.name || '';
                vmWebOrder.data.shipping_address.id_shipping_fee = dataStorage.id_shipping_fee || '';
                vmWebOrder.data.shipping_address.address_detail = dataStorage.address_detail || '';

                vmWebOrder.data.delivery_time = dataStorage.delivery_time;
                vmWebOrder.data.payment_method = dataStorage.payment_method;


            }
        }
        ///////////// END CONFIG /////////////



        ///////////// HELPER FOR VIEW /////////////
        function login() {
            authSvc.popLogin()
        }

        function checkDueDateProduct(due_date) {
            if (due_date && due_date.end_date) {
                if (Date.parse(due_date.end_date) < Date.now())
                    return true;
            }
            return false;
        }

        function showDetailProduct(slug, id) {
            apiProductSvc.popupDetailPro(slug, id);
        }

        function showFormAddressDetails(show) {
            if (show) {
                vmWebOrder.data.shipping_address = {
                    id: '',
                    name: '',
                    phone: '',
                    address_detail: '',
                    id_shipping_fee: ''
                };
                vmWebOrder.data.submitted = false; // hide class error for formInfoOrder
            }
            vmWebOrder.data.showFormAddressDetails = show; //true | false
        }

        function onSelectShippingAddress(index) {
            vmWebOrder.data.shipping_address.name = vmWebOrder.data.list_shipping_address[index]._id;
            vmWebOrder.data.shipping_address.name = vmWebOrder.data.list_shipping_address[index].name;
            vmWebOrder.data.shipping_address.phone = vmWebOrder.data.list_shipping_address[index].phone;
            vmWebOrder.data.shipping_address.address_detail = vmWebOrder.data.list_shipping_address[index].address_detail;
            vmWebOrder.data.shipping_address.id_shipping_fee = vmWebOrder.data.list_shipping_address[index].id_shipping_fee ? vmWebOrder.data.list_shipping_address[index].id_shipping_fee._id : null;
            vmWebOrder.data.shipping_address.district = vmWebOrder.data.list_shipping_address[index].id_shipping_fee ? vmWebOrder.data.list_shipping_address[index].id_shipping_fee.district : '';

            vmWebOrder.data.shipping_address.vocative = vmWebOrder.data.list_shipping_address[index].vocative;
            setShippingFee(); // when change shipping address set shipping again
            checkCoupon();
        }

        function openPageCheckout() {

            helperJsCustom.GA('send', 'event', 'CartDetail', 'ClickButtonOrder', '');
            if ($rootScope.Cart.items.length == 0) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Đặt hàng',
                        message: 'Giỏ hàng của bạn chưa có sản phẩm nào'
                    }
                });
            }
            else {
                $window.location.href = '/dat-hang';
            }
        }
    }
})();
