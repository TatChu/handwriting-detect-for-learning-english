;(function(){
	'use strict';

	Application.registerRouter({
		state: 'dashboard',
		config: {
			url: '/',
			data: {
				title: 'Dashboard',
				menuType: 'dashboard'
			},
			params: {
			},
			templateUrl: 'modules/admin-dashboard/view/client/view.html',
			controller: 'dashboardCtrl',
			controllerAs: 'vmDashboard',
			resolve: dashboardCtrl.resolve
		}
	});
})();
