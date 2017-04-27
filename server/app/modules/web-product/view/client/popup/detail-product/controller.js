; (function () {
    'use strict';

    angular
        .module('bzProduct')
        .controller('popupProductDetail', popupProductDetail);

    function popupProductDetail($scope, $rootScope, $timeout, $window, $bzPopup, $uibModalInstance, webProductSvc, product, orderApiSvc, userSvcApi, apiProductSvc, authSvc) {
        //Vars
        var mvPopPrDe = $scope;
        mvPopPrDe.settings = $window.settings;
        mvPopPrDe.$on('Cart:getCart', getCart);
        mvPopPrDe.allowAddCart = true;
        mvPopPrDe.showDetailContent = false;
        mvPopPrDe.imagesDirectory = settingJs.configs.uploadDirectory.thumb_product || '/files/thumb_image/product_image/';
        mvPopPrDe.imagesProductDirectory = settingJs.configs.uploadDirectory.product || '/files/product_image/';

        // Methods
        mvPopPrDe.popDetPro = popDetPro;
        mvPopPrDe.addToCart = addToCart;
        mvPopPrDe.decreaseCart = decreaseCart;
        mvPopPrDe.addFavoriteProduct = addFavoriteProduct;
        mvPopPrDe.removeFavoriteProduct = removeFavoriteProduct;
        mvPopPrDe.close = close;
        mvPopPrDe.init = init;
        mvPopPrDe.checkDueDate = checkDueDate;
        mvPopPrDe.login = login;
        mvPopPrDe.showDetail = showDetail;
        mvPopPrDe.checkImgOld = apiProductSvc.checkImgOld;
        mvPopPrDe.addToCartGA = apiProductSvc.addToCartGA;
        mvPopPrDe.fixImgProductDetail = apiProductSvc.fixImgProductDetail;

        // Option directive slick
        mvPopPrDe.slickOption = {
            infinite: false,
            speed: 300,
            slidesToShow: 4,
            slidesToScroll: 4,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4
                    }
                },
                {
                    breakpoint: 641,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3
                    }
                },
                {
                    breakpoint: 481,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }
            ]
        };

        mvPopPrDe.slickOptionViewImage = {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            fade: true,
            asNavFor: '.list-image',
            responsive: [{
                breakpoint: 1024,
                settings: {
                    dots: true,
                    vertical: false
                }
            }]
        };

        mvPopPrDe.slickOptionListImage = {
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            vertical: true,
            focusOnSelect: true,
            asNavFor: '.view-image',

            autoplaySpeed: 5000,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            }]
        };

        /*FUNCTION*/
        function init() {
            webProductSvc.detailProduct(product.slug, product.id).then(function (resp) {
                mvPopPrDe.data = resp.data;
                if (resp.check_slug) {
                    getCart();
                    $timeout(function () {
                        angular.element('#pop-detail .fancybox').fancybox({
                            prevEffect: 'none',
                            nextEffect: 'none',
                        });
                        mvPopPrDe.slickSec = true;
                        angular.element('.col-xs-12.col-left .row').removeAttr("style");
                        angular.element('.col-xs-12.col-left .row.text-center').addClass('hidden');

                        // Eff show more detail product
                        var height_detail = angular.element('#pop-detail #text-detail').height();
                        if (height_detail > 350) {
                            mvPopPrDe.showDetailContent = true;
                            mvPopPrDe.detailContent = 'hideContent';
                            mvPopPrDe.detailContentStyle = {
                                'overflow': 'hidden',
                                'max-height': '350px'
                            };
                        }
                        angular.element('#pop-detail .facebook-section').html('<div class="fb-like" data-href="' + $window.location.href + '" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true" style="margin-left: 50px;"></div>');
                        FB.XFBML.parse();
                        mvPopPrDe.detail_infor = $('#pop-detail #text-detail')[0].innerHTML;
                    }, 100);
                    mvPopPrDe.doneLoad = true;
                }
                else {
                    // When slug product url not match slug product get
                    console.log(window.location.href);
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Lỗi',
                            message: 'Có lỗi. Hãy thử lại'
                        }
                    });
                    $uibModalInstance.close();
                }

            });
        }

        function popDetPro(slug, id) {
            $uibModalInstance.close();
            $timeout(function () {
                apiProductSvc.popupDetailPro(slug, id, true);
            }, 50);

        }

        function getCart() {
            if ($rootScope.Cart.items) {
                try {
                    mvPopPrDe.data.product.cart = $rootScope.Cart.items.find(function (item) {
                        return mvPopPrDe.data.product._id == item.id_product;
                    });

                    if (mvPopPrDe.data.product.relative_product_list) {
                        mvPopPrDe.data.product.relative_product_list.forEach(function (item) {
                            item.cart = $rootScope.Cart.items.find(function (cart) {
                                return item._id == cart.id_product;
                            });
                        });
                    }

                    if (mvPopPrDe.data.list_pro_month) {
                        mvPopPrDe.data.list_pro_month.forEach(function (item) {
                            item.cart = $rootScope.Cart.items.find(function (cart) {
                                return item.product._id == cart.id_product;
                            });
                        });
                    }
                } catch (error) {
                    mvPopPrDe.data.product.cart = apiProductSvc.findByIdProduct($rootScope.Cart.items, mvPopPrDe.data.product._id);

                    if (mvPopPrDe.data.product.relative_product_list) {
                        for (var index = 0; index < mvPopPrDe.data.product.relative_product_list.length; index++) {
                            var element = mvPopPrDe.data.product.relative_product_list[index];
                            if (element) {
                                mvPopPrDe.data.product.relative_product_list[index].cart = findPro(element._id);
                            }
                        }
                    }

                    if (mvPopPrDe.data.list_pro_month) {
                        for (var index = 0; index < mvPopPrDe.data.list_pro_month.length; index++) {
                            var element = mvPopPrDe.data.list_pro_month[index];
                            if (element) {
                                mvPopPrDe.data.list_pro_month[index].cart = findPro(element.product._id);
                            }
                        }
                    }
                }
                mvPopPrDe.allowAddCart = true;
            }
        }

        function addToCart(id) {
            if (mvPopPrDe.allowAddCart) {
                mvPopPrDe.allowAddCart = false;
                apiProductSvc.addToCart(id, function (resp) {
                    getCart();
                })
            }
        }

        function decreaseCart(id, quantity) {
            apiProductSvc.decreaseCart(id, quantity, function (resp) {
                getCart();
            })
        }

        function addFavoriteProduct() {
            mvPopPrDe.data.user.favorite_product.push(mvPopPrDe.data.product._id);
            userSvcApi.updateFavoriteProduct(mvPopPrDe.data.user, mvPopPrDe.data.user._id).then(function (resp) {
            }).catch(function (err) {
                console.log(err);
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Lỗi',
                        message: 'Có lỗi. Hãy thử lại'
                    }
                });
                var index = mvPopPrDe.data.user.favorite_product.indexOf(mvPopPrDe.data.product._id);
                if (index != -1) {
                    mvPopPrDe.data.user.favorite_product.splice(index, 1);
                }
            })
        }

        function removeFavoriteProduct() {
            var index = mvPopPrDe.data.user.favorite_product.indexOf(mvPopPrDe.data.product._id);
            mvPopPrDe.data.user.favorite_product.splice(index, 1);
            userSvcApi.updateFavoriteProduct(mvPopPrDe.data.user, mvPopPrDe.data.user._id).then(function (resp) {
            }).catch(function (err) {
                console.log(err);
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Lỗi',
                        message: 'Có lỗi. Hãy thử lại'
                    }
                });
                mvPopPrDe.data.user.favorite_product.push(mvPopPrDe.data.product._id);
                if (index != -1) {
                    mvPopPrDe.data.user.favorite_product.splice(index, 1);
                }
            })
        }

        function close() {
            $uibModalInstance.close();
        }

        function checkDueDate(end_date) {
            if (end_date) {
                end_date = moment(end_date);
                return moment().isBefore(end_date)
            }
            else {
                return true;
            }
        }

        function login() {
            authSvc.popLogin();
        }

        function showDetail() {
            if (mvPopPrDe.detailContent == 'hideContent') {
                mvPopPrDe.detailContent = 'showContent';
                mvPopPrDe.detailContentStyle = {
                    'max-height': 'auto',
                };
            }
            else {
                $('#pop-detail #text-detail').html(mvPopPrDe.detail_infor);
                mvPopPrDe.detailContent = 'hideContent';
                mvPopPrDe.detailContentStyle = {
                    'overflow': 'hidden',
                    'max-height': '350px'
                };
            }
        }

        function findPro(id) {
            var cart;
            try {
                cart = $rootScope.Cart.items.find(function (item) {
                    return item.id_product == id;
                });
            } catch (error) {
                cart = apiProductSvc.findByIdProduct($rootScope.Cart.items, id);
            }
            return cart;
        }
    }
})();