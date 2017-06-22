(function () {
	'use strict';

	angular
		.module('bzUser')
		.constant('userRoles', [
			{ name: 'Super Admin', value: 'super-admin' },
			{ name: 'Admin', value: 'admin' },
			{ name: 'Học viên', value: 'student' }
		]);
})();