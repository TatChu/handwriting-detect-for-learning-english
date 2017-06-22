var Application = (function () {
    'use strict';

    var appName = 'bzApp';
    var appDependencies = [
        'ui.bootstrap',
        'ngSanitize',
        'ngAnimate',
        'ngMessages',
        'ngResource',
        'ui.router',
        'toastr',
        'ngPopup',
        'daterangepicker',
        'angularjs-datetime-picker',
        'ngFileUpload',
        'ngTable',
        'angulike',
        'webcam'
    ];

    angular
        .module(appName, appDependencies)
        .config(config)
        .run(run);

    angular.element(document).ready(function () {
        //Facebook SDK
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/vi_VN/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        angular.bootstrap(document, [appName]);
    });

    function registerModule(name) {
        angular.module(appName).requires.push(name);
    }

    function config(
        $qProvider,
        $httpProvider,
        $locationProvider,
        $bzPopupProvider,
        toastrConfig,
        $interpolateProvider,
        $resourceProvider
    ) {

        /*fix error (Possibly unhandled rejection) angular > 1.5.5*/
        $qProvider.errorOnUnhandledRejections(false);

        $bzPopupProvider.setMessageTemplate('assets/global/message/view.html');

        angular.extend(toastrConfig, {
            extendedTimeOut: 1000,
            timeOut: 1000,
            newestOnTop: true,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            tapToDismiss: true,
            allowHtml: true,
            closeButton: true,
            target: 'body'
        });

        $interpolateProvider.startSymbol('[[');
        $interpolateProvider.endSymbol(']]');

        // Configs HTML5 API Pushstate
        // $locationProvider.html5Mode(false).hashPrefix('!');
        $locationProvider.html5Mode({ enabled: true, requireBase: false, rewriteLinks: false });

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

        // $resourceProvider.defaults.stripTrailingSlashes = false;
    }

    function run(
        $rootScope,
        $window,
        $document,
        $timeout,
        $locale,
        authSvc,
        notiSvc) {

        // In it cart data
        $rootScope.Cart = {
            items: [],
            total: 0,
            total_quantity: 0
        }

        // value config default
        $rootScope.TextOrderConfig = [];

        // Khuyến mãi cho order giao vào buổi chiều
        $rootScope.promotionForOrderDeleveryOnAffternoon = {
            value: 0,
            status: false,
            type: "PC"
        }

        // khuyến mãi cho đơn hàng đầu tiên
        $rootScope.promotionForFirstOrder = {
            value: 0,
            status: false,
            type: "PC"
        };

        $rootScope.freeShipUrban = {
            value: 999999999,
            status: false,
            type: "MN"
        }; // Nội thành
        $rootScope.freeShipSuburb = {
            value: 999999999,
            status: false,
            type: "MN"
        }; // Ngoại thành

        //Init Facebook
        window.fbAsyncInit = function () {
            FB.init({
                appId: settingJs.configs.facebookAppId,
                status: true,
                xfbml: true,
                version: 'v2.9'
            });
        };

        // Config for module angulike
        $rootScope.facebookAppId = settingJs.configs.facebookAppId;


        angular.element('body').removeClass('hide');
        $timeout(function () {
            angular.element('#mod-footer').css({
                visibility: 'visible',
                position: 'relative'
            });
        }, 1500);


        $rootScope._ = window._;
        // $rootScope.socket = io(settingJs.configs.socketUrl);

        // Global variables
        $rootScope.pageData = {};

        // Global methods
        $rootScope.pageMethods = {};
        $rootScope.pageMethods.authSvc = authSvc;
        $rootScope.Url = settingJs.configs.webUrl;

        // Set currency filter
        $locale.NUMBER_FORMATS.GROUP_SEP = '.';

        // List tracked facebook pixel
        $rootScope.list_track_fpq = [];
    }

    return {
        registerModule: registerModule
    };
})();
