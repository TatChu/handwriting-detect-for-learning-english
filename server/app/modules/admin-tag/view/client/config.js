;
(function() {
    'use strict';

    Application.registerModule('bzTag');

    angular
        .module('bzTag', ['xeditable'])
        .run(run);

    function run(editableOptions) {
        editableOptions.theme = 'bs3';
    }
})();