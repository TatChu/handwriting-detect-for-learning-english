;(function(){
	'use strict';

	Application.registerRouter({
		state: 'certificate-list',
		config: {
			url: '/certificate-list?page&limit&sort&role&id&keyword',
			data: {
				title: 'Certificate',
				menuType: 'certificate'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '20'
			},
			templateUrl: 'modules/admin-certificate/view/client/list-certificate/view.html',
			controller: 'certificateCtrl',
			controllerAs: 'vmCertificates',
			// resolve: certificateCtrl.resolve
		}
	});
})();
