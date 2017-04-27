; (function () {
	'use strict';

	angular
		.module('bzUser')
		.controller('orderCtrl', orderCtrl);

	function orderCtrl($scope, $rootScope, $state, $window, $bzPopup, $uibModal, bzResourceSvc, NgTableParams, userSvc, apiProductSvc) {
		var vmOrder = this;

		vmOrder.menuActive = "order";
		//Vars
		vmOrder.formData = {};
        // vmOrder.imagesDirectory = settingJs.configs.uploadDirectory.product;
		vmOrder.submitted = false;
		vmOrder.lockForm = false;
		vmOrder.data = $window.data;
		var jRes = jRespond([
			{ label: 'mobile', enter: 0, exit: 1023 },
			{ label: 'desktop', enter: 1024, exit: 10000 }
		]);
		// Methods
		vmOrder.checkStatus = checkStatus;
		// vmOrder.checkResponse = checkResponse;
		vmOrder.popupDetail = apiProductSvc.popupDetailPro;
		vmOrder.showAll = showAll;
		console.log(vmOrder.data);
		//Init
		angular.element('#table').removeClass('hidden');
		vmOrder.tableParams = new NgTableParams({ count: 10 }, {counts: [], dataset: vmOrder.data});
		
		function checkStatus(status) {
			if(status === "PROCCESS")
				return "Đang xử lý";
			if(status === "FINISH")
				return "Hoàn thành";
			if(status === "CANCEL")
				return "Đã hủy";
		}


		// function checkResponse (slug,id) {
		// 		jRes.addFunc({
		// 			breakpoint: 'mobile',
		// 			enter: function () {
		// 				window.location.href = settings.services.webUrl + "/san-pham/" + slug + '-' + id;
		// 				// console.log('start mo');
		// 			}
		// 		});

		// 	 jRes.addFunc({
		// 		breakpoint: 'desktop',
		// 		enter: function () {
		// 			popupDetail(slug, id);
					
		// 		}
		// 	});
		// 	return;
		// }
		

		


		
		
		function showAll(item) {
			if (typeof item.showAll == "undefined")
				item.showAll = true;
			else {
				item.showAll = !item.showAll;
			}
		}

		
	}
})();