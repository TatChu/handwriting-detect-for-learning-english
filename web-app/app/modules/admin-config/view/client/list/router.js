;(function(){
	'use strict';

	Application.registerRouter({
		state: 'configs',
		config: {
			url: '/configs?page&limit&sort&role&id&keyword',
			data: {
				title: 'Configs',
				menuType: 'config'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10'
			},
			templateUrl: 'modules/admin-config/view/client/list/view.html',
			controller: 'configListCtrl',
			controllerAs: 'vmListConfig',
			resolve: configListCtrl.resolve
		}
	});
})();
