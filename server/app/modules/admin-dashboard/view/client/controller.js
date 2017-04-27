var dashboardCtrl = (function () {
	'use strict';

	angular
		.module('bzDashboard')
		.controller('dashboardCtrl', dashboardCtrl);

	function dashboardCtrl($scope, $window, $state, authSvc, bzResourceSvc) {
		var vmDashboard = this;
		// $state.go('dashboard');

		/*XÉT QUYỀN TRUY CẬP ROUTER*/
		if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('dashboard','view') ))){
            $state.go('error403');
        }

		bzResourceSvc.api($window.settings.services.admin + '/dashboard')
			.get({}, function (resp) {
				vmDashboard.info = resp;
			});

	}
	var resolve = {
		/* @ngInject */
		preload: function (bzPreloadSvc) {
			return bzPreloadSvc.load([]);
		}
	};

	return {
		resolve: resolve
	};
})();