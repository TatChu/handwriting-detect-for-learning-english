(function () {
    'use strict';

    angular
        .module('bzApp')
        .service('bzUtilsSvc', bzUtilsSvc)
        .service('bzResourceSvc', bzResourceSvc)
        .factory('bzPreloadSvc', bzPreloadSvc)
        .service('authSvc', authSvc)
        .service('notiSvc', notiSvc)
        .factory('userApiFac', userApiFac)
        .service('orderApiSvc', orderApiSvc)
        .service('bzUpload', bzUpload);

    function orderApiSvc($q, $window, $rootScope, bzResourceSvc) {
        return {
            getCart: getCart,
            update: update,
        }
        /**
         * Update product
         * @param {*} type enum: 'add-product' || 'set-quantity' || 'delete-product' || 'delete-cart'
         * @param {*} data custom by type: {product: id_product, quantity: number || string}
         */
        function update(type, data) {
            var defer = $q.defer();
            if (type === 'add-product')
                return addProduct(data.product, data.quantity);

            if (type === 'set-quantity')
                return setQuantity(data.product, data.quantity);

            if (type === 'delete-product')
                return deleteProduct(data.product);

            if (type === 'delete-cart')
                return deleteCart();

            defer.reject('Type mismach');
            return defer.promise;
        }

        function getCart() {
            var defer = $q.defer();
            bzResourceSvc.api($window.settings.services.apiUrl + '/order/cart')
                .get({}, function (resp) {
                    $rootScope.Cart = resp.cart;
                    $rootScope.$broadcast('Cart:getCart', resp.cart);
                    defer.resolve(resp);
                }, function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }

        function deleteCart() {
            var defer = $q.defer();
            bzResourceSvc.api($window.settings.services.apiUrl + '/order/delete-cart')
                .get({}, function (resp) {
                    $rootScope.Cart = { items: [], total: 0 };
                    $rootScope.$broadcast('Cart:getCart', resp.cart);
                    defer.resolve(resp);
                }, function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }

        function deleteProduct(product) {
            var defer = $q.defer();
            bzResourceSvc.api($window.settings.services.apiUrl + '/order/delete-product/' + product)
                .get({}, function (resp) {
                    $rootScope.Cart = resp.cart;
                    $rootScope.$broadcast('Cart:getCart', resp.cart);
                    defer.resolve(resp);
                }, function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }

        function setQuantity(product, new_quantity) {
            var defer = $q.defer();
            bzResourceSvc.api($window.settings.services.apiUrl + '/order/set-quantity/' + product + '/' + new_quantity)
                .get({}, function (resp) {
                    if (resp.success) {
                        $rootScope.Cart = resp.cart;
                        $rootScope.$broadcast('Cart:getCart', resp.cart);
                    }
                    defer.resolve(resp);
                }, function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }

        function addProduct(product, quantity) {
            var defer = $q.defer();
            bzResourceSvc.api(settingJs.configs.userApiUrl + '/order/' + product + '/' + quantity)
                .get({}, function (resp) {
                    if (resp.success) {
                        $rootScope.Cart = resp.cart;
                        $rootScope.$broadcast('Cart:getCart', resp.cart);
                    }
                    defer.resolve(resp);
                }, function (err) {
                    defer.reject(err);
                });
            return defer.promise;
        }

    }
    function userApiFac($window, bzResourceSvc) {
        return bzResourceSvc.api(settingJs.configs.userApiUrl + '/user/:method/:id', { method: '@method', id: '@id' });
    }

    function bzUpload($q, bzResourceSvc) {
        return {
            uploadBase64: uploadBase64
        };
        function uploadBase64(data) {
            var defer = $q.defer();
            bzResourceSvc.api(settingJs.configs.userApiUrl + '/upload/base64')
                .save(data, function (resp) {
                    defer.resolve(resp);
                }, function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        }
    }

    function notiSvc($q, bzResourceSvc) {
        return {
            getDupContact: getDupContact,
        };

        function getDupContact() {
            var defer = $q.defer();
            bzResourceSvc.api(settingJs.configs.adminUrl + '/noti-dup-contact')
                .get({}, {}, function (resp) {
                    defer.resolve(resp);
                }, function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        }
    }

    function authSvc($uibModal, $q, $window, userApiFac, bzResourceSvc) {
        $window.user = $window.user || {};

        return {
            /*Role*/
            isSuperAdmin: isSuperAdmin,
            isAdmin: isAdmin,
            hasPermission: hasPermission,
            // isSale: isSale,
            // isSaleManager: isSaleManager,
            exist: exist,
            /* */
            register: register,
            /*Info*/
            getProfile: getProfile,
            setProfile: setProfile,
            isSignedIn: isSignedIn,
            siteLogin: siteLogin,
            siteLogout: siteLogout,
            popLogin: popLogin,
            popRegister: popRegister,
            popForgotPass: popForgotPass,
            popChangePass: popChangePass,
            postChangePass: postChangePass,
            forgotPassword: forgotPassword,
            resetPassword: resetPassword,
            // create    : create,
            update: update,
            /*Facebook*/
            getFacebook: getFacebook,
            facebookLogin: facebookLogin
        };

        /*ROLES*/
        function isSuperAdmin() {
            if (_.intersection($window.user.scope, ['super-admin']).length === 0)
                return false;
            return true;
        }

        function isAdmin() {
            if (_.intersection($window.user.scope, ['admin']).length === 0)
                return false;
            return true;
        }

        function hasPermission(resource, permission) {
            var isString = typeof permission == 'string' ? true : false;
            var permissions = $window.permissions;
            var p = null;

            angular.forEach(permissions, function (value, key) {
                if (key === resource) {
                    p = value;
                }
            });
            if (p) {
                if (p[0] === '*') {
                    // console.log(1);
                    return true;
                }

                if (isString) {
                    if (_.intersection([permission], p).length === 1) {
                        // console.log(2);
                        return true;
                    }
                }

                if (_.intersection(permission, p).length === permission.length) {
                    // console.log(3);
                    return true;
                }

            }
            return false;


        }
        // function isSale(){
        //     $window.user.saleman = $window.user.saleman || {};
        //     if(_.intersection($window.user.scope, ['sale']).length !== 0 && $window.user.saleman.active === true)
        //         return true;
        //     return false;
        // }

        // function isSaleManager(){
        //     $window.user.saleman = $window.user.saleman || {};
        //     if(isSale() && $window.user.saleman.manager === true)
        //         return true;
        //     return false;
        // }

        function exist(roles) {
            return _.intersection($window.user.scope, roles).length > 0;
        }
        /* */
        function register(data) {


            var register = new userApiFac(data);

            return register.$save({ method: 'register' });
        }

        /*INFO*/
        function getProfile() {
            var profileData = $window.user;
            return profileData;
        }

        function setProfile(data) {
            Storage.set(settingJs.appPrefix + 'bzp', data, settingJs.storageExpireTime);
            Storage.set(settingJs.appPrefix + 'bzl', true, settingJs.storageExpireTime);
            return data;
        }

        function isSignedIn() {
            var log = Storage.get(settingJs.appPrefix + 'bzl');
            return log ? true : false;
        }

        function siteLogin(data, successCb, errorCb) {
            var defer = $q.defer();

            bzResourceSvc.api($window.settings.services.apiUrl + '/user/login')
                .save({}, data, function (resp) {
                    setProfile(resp);
                    defer.resolve(resp);
                    if (angular.isFunction(successCb)) {
                        successCb(resp);
                    }
                }, function (err) {
                    defer.reject(err);
                    if (angular.isFunction(errorCb)) {
                        errorCb(err);
                    }
                });

            return defer.promise;
        }

        function siteLogout(callback) {
            var profile = getProfile();
            bzResourceSvc.api($window.settings.services.apiUrl + '/user/logout')
                .save({}, {}, function (resp) {
                    setProfile(undefined);
                    if (angular.isFunction(callback)) {
                        callback(resp);
                    }
                    $window.location.href = settings.services.webUrl;
                });
        }
        function popLogin(urlRedirect) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: settings.services.webUrl + '/modules/web-auth/view/client/popup/login/view.html',
                controller: 'popLoginCtrl',
                controllerAs: 'vmLogin',
            });
            modalInstance.result.then(function (resp) {
                if (!resp) {
                    if (urlRedirect) {
                        $window.location.href = urlRedirect;
                    }
                    else {
                        $window.location.reload();
                    }

                }
                return resp;

            });
        }
        function popRegister() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: settings.services.webUrl + '/modules/web-auth/view/client/popup/register/view.html',
                controller: 'popRegisterCtrl',
                controllerAs: 'vmRegister',
            });
        }
        function popForgotPass() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: settings.services.webUrl + '/modules/web-auth/view/client/popup/forgot-pass/view.html',
                controller: 'popForgotPassCtrl',
                controllerAs: 'vmForgotPass',
            });
        }
        function popChangePass() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/admin-user/view/client/popup/change-pass/view.html',
                controller: 'popChangePassCtrl',
                controllerAs: 'mvCPass',
            });
        }

        function postChangePass(data) {
            var postChangePass = new userApiFac(data);

            return postChangePass.$save({ method: 'change-password' });
        }

        function forgotPassword(data) {
            var forgotPassword = new userApiFac(data);

            return forgotPassword.$save({ method: 'forgot-password' });
        }

        function resetPassword(data) {
            var resetPassword = new userApiFac(data);

            return resetPassword.$save({ method: 'reset-password' });
        }
        // function create(data, id){
        //     var createData = new userFac(data);

        //     return createData.$save({method: 'user'});
        // }

        function update(data, id) {
            var createData = new userApiFac(data);

            return createData.$update({ id: id });
        }

        /*FACEBOOK*/

        function getFacebook() {
            var deferred = $q.defer();
            FB.getLoginStatus(function (response) {
                if (response.status === "connected") {
                    var accessToken = response.authResponse.accessToken;
                    FB.api("/me", { fields: "id,name,email,picture" }, function (response) {
                        // console.log('da login',response);
                        deferred.resolve(response);
                    });
                } else {
                    FB.login(function (response) {
                        if (response.status === 'not_authorized') {
                            deferred.resolve({ error: 'Vui lòng đồng ý sử dụng ứng dụng để đăng nhập tài khoản' });
                        }
                        if (response.status === 'connected') {
                            var accessToken = response.authResponse.accessToken;
                            FB.api("/me", { fields: "id,name,email,picture" }, function (response) {
                                // console.log('moi login',response);
                                deferred.resolve(response);
                            });
                        }
                    }, { scope: "email" });
                }
            });

            return deferred.promise;
        }

        /*
        * Login by Facebook Account function
        */
        function facebookLogin(fbAccount, successCb, errorCb) {
            let defer = $q.defer();
            let data = {
                email: fbAccount.email,
                provider_id: fbAccount.id,
                name: fbAccount.name,
                profile_picture: fbAccount.profile_picture
            };

            bzResourceSvc.api($window.settings.services.userApi + '/user/facebook-login')
                .save({}, data, function (resp) {
                    setProfile(resp);
                    defer.resolve(resp);
                    if (angular.isFunction(successCb)) {
                        successCb(resp);
                    }
                }, function (err) {
                    defer.reject(err);
                    if (angular.isFunction(errorCb)) {
                        errorCb(err);
                    }
                });
            return defer.promise;
        }
    }

    function bzUtilsSvc($bzPopup) {
        return {
            recusive: recusive,
            cropAvatar: cropAvatar,
            findObject: findObject,					// Tìm đối tượng trong mảng đối tượng
            textToSlug: textToSlug,                 // genarator slug
            setLocalStorage: setLocalStorage,
            getLocalStorage: getLocalStorage,
            removeLocalStorage: removeLocalStorage,

            setInfoUser: setInfoUser,
            getInfoUser: getInfoUser,
            removeInfoUser: removeInfoUser,

        };
        function textToSlug(string) {
            if (string) {
                //Đổi chữ hoa thành chữ thường
                var slug = string.toLowerCase();

                //Đổi ký tự có dấu thành không dấu
                slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
                slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
                slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
                slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
                slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
                slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
                slug = slug.replace(/đ/gi, 'd');
                //Xóa các ký tự đặt biệt
                slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
                //Đổi khoảng trắng thành ký tự gạch ngang
                slug = slug.replace(/ /gi, "-");
                //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
                //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
                slug = slug.replace(/\-\-\-\-\-/gi, '-');
                slug = slug.replace(/\-\-\-\-/gi, '-');
                slug = slug.replace(/\-\-\-/gi, '-');
                slug = slug.replace(/\-\-/gi, '-');
                //Xóa các ký tự gạch ngang ở đầu và cuối
                slug = '@' + slug + '@';
                slug = slug.replace(/\@\-|\-\@|\@/gi, '');
                return slug;

            }

            return string;
        }

        function findObject(field, value, array) {
            function findCherries(fruit) {
                return fruit[field] === value;
            }

            return array.find(findCherries);
        }

        function recusive(data, parentId, seperator) {
            var output;
            var tmp = [];
            seperator = seperator || '';
            if (angular.isArray(data)) {
                var items = data.filter(function (item) { return item.parentId === parentId });
                if (items.length) {
                    for (var i = 0; i < items.length; i++) {
                        items[i].name = seperator + items[i].name;

                        tmp.push(items[i]);

                        var subs = recusive(data, items[i].id, seperator + "—");

                        for (var j = 0; j < subs.length; j++) {
                            tmp.push(subs[j]);
                        }
                    }
                }
                output = tmp;
            } else {
                output = data;
            }
            return output;
        }

        function cropAvatar() {
            $bzPopup.open({
                templateUrl: 'modules/popup/cropper/view.html',
                closeOnBg: false,
                data: {
                    ratio: 1,
                    width: 320,
                    height: 320,
                    type: 'image/jpeg',
                    event: 'bz:CropperAvatarSuccess',
                    image: 'images/demo.jpg',
                    props: {
                        btnOk: 'Lưu',
                        btnCancel: 'Huỷ bỏ',
                        btnOkEvent: 'bz:CropperAvatarOk', // hoặc function(){}
                        btnCancelEvent: 'bz:CroppperAvatarCancel' // hoặc function(){}
                    }
                }
            });
        }

        function setLocalStorage(key, data) {
            if (typeof (Storage) !== "undefined") {
                Storage.set(key, data, settingJs.storageExpireTime);
            } else {
                console.error('Sorry! The browser does not support Storage.');
            }
        }

        function getLocalStorage(key) {
            if (typeof (Storage) !== "undefined") {
                var data = Storage.get(key);
                return data;
            } else {
                console.error('Sorry! The browser does not support Storage.');
                return null;
            }
        }

        function removeLocalStorage(key) {
            if (typeof (Storage) !== "undefined") {
                Storage.remove(key);
            } else {
                console.error('Sorry! The browser does not support Storage.');
            };
        }

        function setInfoUser(data) {
            setLocalStorage(settingJs.appPrefix + '_infoUser', data);
        }

        function getInfoUser() {
            return getLocalStorage(settingJs.appPrefix + '_infoUser');
        }

        function removeInfoUser() {
            removeLocalStorage(settingJs.appPrefix + '_infoUser');
        }
    }

    function bzResourceSvc($resource) {
        return {
            api: api
        };

        function api(apiName, params, methods) {
            methods = methods || {};
            methods.get = angular.extend({}, methods.get);

            methods.query = angular.extend({
                isArray: true
            }, methods.query);

            methods.update = angular.extend({
                method: 'PUT'
            }, methods.update);

            methods.upload = angular.extend({
                method: 'POST',
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }, methods.upload);

            return $resource(apiName, params, methods);
        }
    }

    function bzPreloadSvc($q) {
        return {
            load: function (list) {
                var defer = $q.defer();
                helperJs.preloader(list, function () {
                    defer.resolve();
                });
                return defer.promise;
            }
        };
    }
})();