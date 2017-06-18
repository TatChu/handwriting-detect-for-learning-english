; (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('recognitionDataCtrl', recognitionDataCtrl);

	function recognitionDataCtrl($scope, $rootScope, $state, $window, $bzPopup, $uibModal, customResourceSrv, userSvc, authSvc, editableOptions) {
		var vmRecognition = this;
		vmRecognition.arraysChart = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

		vmRecognition.userFolder = $window.userFolder;
		vmRecognition.menuActive = 'recognition';
		console.log(vmRecognition.userFolder);
	}
})();