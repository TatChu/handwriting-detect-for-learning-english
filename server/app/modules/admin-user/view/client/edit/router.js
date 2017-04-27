;(function(){
	'use strict';

	Application.registerRouter({
		state: 'user-edit',
		config: {
			url: '/user-edit&id',
			data: {
				title: 'Tài khoản',
				menuType: 'add-user'
			},
			params: {
				// page: '1',
				// sortfield: 'createdAt',
				// sortdir: 'desc',
				// limit: '10'
			},
			templateUrl: 'modules/admin-user/view/client/edit/view.html',
			controller: 'userEditCtrl',
			controllerAs: 'userEdit',
			resolve: userEditCtrl.resolve
		}
	});
})();
