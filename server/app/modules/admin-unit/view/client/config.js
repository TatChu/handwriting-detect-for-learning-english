;
(function() {
    'use strict';

    Application.registerModule('bzUnit');

    angular
        .module('bzUnit', [])
        .run(run);

    function run() {
        // console.log("Preparing to register module Unit");
    }
})();