;(function(){
	'use strict';

	Application.registerModule('bzUser');

	angular
	.module('bzUser', ['xeditable'])
	.run(run);

	function run(authSvc, editableOptions) {
        editableOptions.theme = 'bs3';
    }
})();