;(function(){
	'use strict';

	Application.registerRouter({
		state: 'error404',
		config: {
			url: '/error404',
			data: {
				title: 'Error 404',
				menuType: 'error404'
			},
			templateUrl: 'modules/admin-core/view/client/error/404.html',
		}
	});

	Application.registerRouter({
		state: 'error403',
		config: {
			url: '/error403',
			data: {
				title: 'Error 403',
				menuType: 'error403'
			},
			templateUrl: 'modules/admin-core/view/client/error/403.html',
		}
	});
})();