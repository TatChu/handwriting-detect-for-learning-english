var searchCtrl = (function () {
	'use strict';

	angular
		.module('bzWebHome')
		.controller('searchCtrl', searchCtrl);

	function searchCtrl($scope, $window, $timeout, $location, bzResourceSvc, WebSearchSvc, apiProductSvc) {
		// Vars
		var vmSearch = $scope;
		vmSearch.params = $location.search();
		vmSearch.settings = $window.settings;
		vmSearch.imagesDirectory = settingJs.configs.uploadDirectory.thumb_product || '/files/thumb_image/product_image/';
		vmSearch.imagesProductDirectory = settingJs.configs.uploadDirectory.product || '/files/product_image/';

		// Method
		vmSearch.init = init;
		vmSearch.submit = submit;
		vmSearch.link = link;
		vmSearch.searchResult = searchResult;
		vmSearch.checkImgOld = apiProductSvc.checkImgOld;

		// Functions

		function init(section) {
			vmSearch.search = vmSearch.params.q;
			vmSearch.section = section;
			$(section).find('.search-input').removeAttr('disabled').autocomplete({
				source: function (request, response) {

				},
				minLength: 1,
			});
			$(section).find('#error-section').removeClass('hidden');
			$(section).find('.search-section').removeClass('hidden');
			$(section).removeAttr('style');
		}

		function submit(form) {
			helperJsCustom.GA('send', 'event', 'Header', 'ClickSearchButton', '');
			if (!form.$valid) {
				$scope.search_input = "error";
				return;
			}
			form.$submitted = false;
			if (vmSearch.search_selected.type == 0) {
				WebSearchSvc.addSearch({
					search: sanitizeHtml(vmSearch.search_selected.text)
				}).then(function (resp) {
					if (resp.success) {
						$window.location.href = $window.settings.services.webUrl + '/tim-kiem?q=' + encodeURI(sanitizeHtml(vmSearch.search));
					}else {
						$scope.search_input = "error";
						return;
					}
				})
			}
			if (vmSearch.search_selected.type == 1) {
				var tmp = vmSearch.search_selected;
				$window.location.href = $window.settings.services.webUrl + '/san-pham/' + tmp.slug + '-' + tmp.id;
			}

		}

		function link(search) {
			WebSearchSvc.addSearch({
				search: search
			}).then(function (resp) {
				if (resp.success) {
					$window.location.href = $window.settings.services.webUrl + '/tim-kiem?q=' + encodeURI(sanitizeHtml(search));
				}
			})
		}

		function searchResult(form) {
			form.$submitted = false;
			vmSearch.searching = true;
			$scope.search_input = "";

			WebSearchSvc.search({ q: vmSearch.search }).then(function (resp) {
				vmSearch.searchTxt = resp.searchList;
				vmSearch.productTxt = resp.productList;
				vmSearch.searching = false;
				vmSearch.index_search = 0;
				$timeout(function () {
					createSelectArr(vmSearch.section);
					updownSelect(vmSearch.section);
				}, 100);
			});
		}

		function updownSelect(section) {
			var list_select = $(section).find('.searching .select'),
				input_search = $(section).find('.search-input');
			if (vmSearch.searchTxt.length > 0 || vmSearch.productTxt.length > 0) {
				input_search.on('keyup', (function (e) {
					// When Press down button
					if (e.keyCode == 40) {
						if (vmSearch.index_search <= vmSearch.selectArr.length - 3) {
							vmSearch.index_search++;
						}
					}
					// When Press Up button
					if (e.keyCode == 38) {
						if (vmSearch.index_search >= 0) {
							vmSearch.index_search--;
						}
					}

					// Envent when press updow
					if (e.keyCode == 40 || e.keyCode == 38) {
						list_select.removeClass('selected_item');
						var selected = vmSearch.index_search;
						var item_selected = vmSearch.selectArr[selected + 1];
						vmSearch.search = item_selected.text;
						vmSearch.search_selected = item_selected;
						$scope.$apply();
						$(list_select[selected]).addClass('selected_item');
					}
				}));
			};
		}

		// Reset input search
		function createSelectArr(section) {
			var list_select = $(section).find('.searching .select'),
				input_search = $(section).find('.search-input');
			input_search.unbind("keyup");
			list_select.removeClass('selected_item');

			// Create list select arr
			vmSearch.selectArr = [{ text: vmSearch.search, type: 0 }]
				.concat(vmSearch.searchTxt.map(function (item) {
					return {
						text: item.keyword,
						type: 0
					}
				})).concat(vmSearch.productTxt.map(function (item) {
					return {
						text: item.name,
						type: 1,
						slug: item.slug,
						id: item._id
					}
				}));

			// Reset search
			vmSearch.index_search = -1;
			vmSearch.search_selected = vmSearch.selectArr[0];
		}
	}
})();