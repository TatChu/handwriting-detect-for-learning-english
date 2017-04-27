;(function(){
	'use strict';

	Application.registerRouter({
		state: 'certificate-product',
		config: {
			url: '/certificate-product/{id}?page&limit&sort&role&keyword',
			data: {
				title: 'Certificate',
				menuType: 'certificate'
			},
			params: {
				page: '1',
				sort: '-createdAt',
				limit: '10'
			},
			templateUrl: 'modules/admin-certificate/view/client/certificate-product/view.html',
			controller: 'certificateProductCtrl',
			controllerAs: 'vmCertificateProduct',
			// resolve: certificateProductCtrl.resolve
		}
	});
})();