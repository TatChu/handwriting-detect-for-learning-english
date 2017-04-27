;(function(){
	'use strict';

	Application.registerModule('bzAuth');

	angular
	.module('bzAuth', ['xeditable'])
	.run(run);

	function run(authSvc, editableOptions) {
        editableOptions.theme = 'bs3';
    }
})();
