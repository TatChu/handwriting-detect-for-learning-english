;(function(){
	'use strict';

	Application.registerRouter({
		state: 'logs',
		config: {
			url: '/log?page&limit&action&label&date',
			data: {
				title: 'System log',
				menuType: 'log'
			},
            params: {
				page: '1',
				limit: '20'
			},
			templateUrl: 'modules/admin-log/view/client/list/log-list.html',
			controller: 'auditLogCtrl',
			controllerAs: 'vmLog',
			resolve: auditLogCtrl.resolve
		}
	});
})();
