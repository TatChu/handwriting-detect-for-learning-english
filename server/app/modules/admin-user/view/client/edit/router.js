;(function(){
	'use strict';

	Application.registerRouter({
		state: 'user-edit',
		config: {
			url: '/user-edit?module&page&filter&limit&cateid&sortfield&sortdir&publish&id&keyword',
			data: {
				title: 'Bài viết',
				menuType: 'user'
			},
			params: {
				page: '1',
				sortfield: 'createdAt',
				sortdir: 'desc',
				limit: '10'
			},
			templateUrl: 'modules/admin-user/view/client/edit/view.html',
			controller: 'userEditCtrl',
			controllerAs: 'userEdit',
			resolve: userEditCtrl.resolve
		}
	});
})();
