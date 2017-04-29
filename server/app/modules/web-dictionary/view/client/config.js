; (function () {
    'use strict';

    Application.registerModule('bsDictionary');
    angular
        .module('bsDictionary', ['angucomplete'])
        .run(run);

    function run(authSvc) {

    }
})();