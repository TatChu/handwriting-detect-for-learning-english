;(function(){
	'use strict';

	Application.registerRouter({
		state: 'updateRecognition',
		config: {
			url: '/recognition/update-json',
			data: {
				title: 'test resize',
				menuType: 'test-resize'
			},
			templateUrl: 'modules/admin-recognition/view/client/update-json/view.html',
			controller: 'updateRecognitonDataCtrl',
			controllerAs: 'vmPRR',
			resolve: updateRecognitonDataCtrl.resolve
		}
	});
})();

