; (function () {
    'use strict';

    Application.registerModule('bsDictionary');
    angular
        .module('bsDictionary', ['angucomplete-alt'])
        .run(run);

    function run(authSvc) {
    }
})();