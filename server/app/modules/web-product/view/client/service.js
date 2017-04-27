(function () {
    'use strict';

    angular
        .module('bzProduct')
        .factory('webProductFac', webProductFac)
        .service('webProductSvc', webProductSvc)
        .service('apiProductSvc', apiProductSvc);

    function webProductFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.webUrl + '/:method/:id',
            { method: '@method', id: '@id' });
    }

    function webProductSvc($q, $window, bzResourceSvc, webProductFac) {
        return {
            detailProduct: detailProduct
        };

        function detailProduct(slug, id) {
            var getData = new webProductFac();
            return getData.$get({ method: 'san-pham', id: slug + '-' + id, api: true });
        }
    }

    function apiProductSvc($rootScope, $window, $uibModal, $sce, webProductSvc, orderApiSvc) {
        return {
            popupDetailPro: popupDetailPro,
            addToCart: addToCart,
            decreaseCart: decreaseCart,
            findByIdProduct: findByIdProduct,
            checkImgOld: checkImgOld,
            fixImgProductDetail: fixImgProductDetail,
            addToCartGA: addToCartGA
        };

        function popupDetailPro(slug, id) {
            var path = "/san-pham/" + slug + '-' + id;
            helperJsCustom.GA('send', 'pageview', path);
            if ($(window).width() > 768) {
                $window.history.pushState(null, "title", path);

                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: settings.services.webUrl + '/modules/web-product/view/client/popup/detail-product/view.html',
                    controller: 'popupProductDetail',
                    controllerAs: 'vmPopProDe',
                    resolve: {
                        product: function () {
                            return angular.copy({
                                slug: slug,
                                id: id
                            });
                        },
                    }
                });

                modalInstance.result.then(function (resp) {
                    $window.history.back();
                }, function () {
                    $window.history.back();
                });
            }
            else {
                window.location.href = settings.services.webUrl + path;
            }
        }

        function addToCart(id, cb) {
            orderApiSvc.update('add-product', { product: id, quantity: 1 }).then(function (res) {
                cb(res);
            }).catch(function (err) {
                console.log(err);
            })
        }

        function decreaseCart(id, quantity, cb) {
            var new_quantity = quantity - 1;
            orderApiSvc.update('set-quantity', { product: id, quantity: new_quantity }).then(function (res) {
                cb(res);
            }).catch(function (err) {
                console.log(err);
            })
        }

        // Fix for ie
        function findByIdProduct(arr, id_product) {
            for (var index = 0; index < arr.length; index++) {
                var element = arr[index];
                if (element.id_product == id_product) {
                    return element;
                }
            }
            return undefined;
        }

        // Fix for transfer database
        function checkImgOld(new_url, image) {
            let tmp_arr = image.split('/');
            if (tmp_arr.length > 1) {
                var url = settingJs.configs.uploadDirectory.media_old_product.slice(0, -1);
                return url + image;
            }
            return new_url + image;
        }

        function fixImgProductDetail(content) {
            let urlReplaceLeft = new RegExp('{{media url="', 'g');
            let urlReplaceRight = new RegExp('"}}', 'g');
            let replaceUrl2 = new RegExp("//mhv-live.bizzon.com.vn", 'g')

            content = content.replace(urlReplaceLeft, settings.services.webUrl + settingJs.configs.uploadDirectory.media_old).replace(urlReplaceRight, '').replace(replaceUrl2, settings.services.webUrl);
            return $sce.trustAsHtml(content);
        }

        function addToCartGA(product) {
            if (product) {
                var price = product.price;
                if (product.promotion && product.promotion.status) {
                    if (product.promotion.type == 'PC') {
                        price = price * (100 - product.promotion.value) / 100
                    }
                    else {
                        price = price - product.promotion.value;
                    }
                }
                if ($rootScope.list_track_fpq.indexOf(product._id) == -1) {
                    $rootScope.list_track_fpq.push(product._id);
                    fbq('track', 'AddToCart', {
                        value: price,
                        currency: 'VND'
                    });
                }


            }
        }
    }
})();