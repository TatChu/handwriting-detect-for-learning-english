(function () {
	'use strict';

	angular
		.module('bzApp')
		.filter('bzTrustHtml', bzTrustHtml)						// Cho phép hiển thị dữ liệu là html
		.filter('bzTrustResource', bzTrustResource)
		.filter('bzCurrency', bzCurrency)
		.filter('bzHexToRgb', bzHexToRgb)
		.filter('bzTripHtml', bzTripHtml)
		.filter('bzFormatDate', bzFormatDate)
		.filter('bzFirstPage', bzFirstPage)
		.filter('bzObjectKeysLength', bzObjectKeysLength);


	function bzTrustHtml($sce) {
		return function (data) {
			return $sce.trustAsHtml(data);
		};
	}
	function bzTrustResource($sce) {
		return function (data) {
			return $sce.trustAsResourceUrl(data);
		};
	}
	function bzCurrency() {
		return function (data) {
			return helperJs.formatMoney(data);
		};
	}

	function bzHexToRgb() {
		return function (data, alpha) {
			return helperJs.hexToRgb(data, alpha);
		};
	}

	function bzTripHtml() {
		return function (data) {
			return String(data).replace(/<[^>]+>/gm, '');
		};
	}

	function bzFormatDate() {
		return function (data, format) {
			var date = new Date(data);
			var convertedDate = moment(date).format(format);
			return convertedDate;
		};
	}

	function bzFirstPage() {
		return function (data, start) {
			start = +start;
			if (angular.isArray(data)) {
				return data.slice(start);
			} else {
				return data;
			}
		};
	}

	function bzObjectKeysLength() {
		return function (obj) {
			return Object.keys(obj).length;
		};
	}
})();