;(function(){
	'use strict';

	Application.registerRouter({
		state: 'test-resize-img',
		config: {
			url: '/test/resize-img',
			data: {
				title: 'test resize',
				menuType: 'test-resize'
			},
			templateUrl: 'modules/admin-test/view/client/test-resize/view.html',
			controller: 'testResizeCtrl',
			controllerAs: 'vmTestResize',
			resolve: testResizeCtrl.resolve
		}
	});
})();
