(function(){
	'use strict';

	angular
	.module('ngPopup', ['toastr'])
	.provider('$bzPopup', popupProvider)

	function popupProvider(){
		var config = {
			messageTemplate: ''
		};

		this.setMessageTemplate = function(val) {
			config.messageTemplate = val;
		};

		this.$get = function($window, $timeout, $q, $rootScope, $http, $compile, $templateCache, toastr) {
			var popup = $q.defer();

			popup.message = function(options){
				options = helperJs.extend({
					templateUrl: config.messageTemplate
				}, options);

				return loadPopup(options);
			};

			popup.toastr = function(options){
				var deferred = $q.defer();

				options = angular.extend(options, {
					timeout: 3000
				});

				switch(options.type){
					case 'success':
					deferred = toastr.success(options.data.message, options.data.title, {timeOut: options.timeout}).open;
					break;
					case 'error':
					deferred = toastr.error(options.data.message, options.data.title, {timeOut: options.timeout}).open;
					break;
					case 'warning':
					deferred = toastr.warning(options.data.message, options.data.title, {timeOut: options.timeout}).open;
					break;
					default:
					deferred = toastr.info(options.data.message, options.data.title, {timeOut: options.timeout}).open;
				}

				return deferred.promise;
			};

			popup.close = function(){
				var defer = $q.defer();
				var magnificPopup = $.magnificPopup.instance;
				magnificPopup.close();
				defer.resolve();
				return defer.promise;
			};

			popup.open = function(options){
				options = angular.extend(options, {});
				return loadPopup(options);
			};

			function loadPopup(options) {
				var defer = $q.defer(),
				promise,
				tplData = '',
				options = angular.extend(options, {
					effect: 'bzFromTop'
				}),
				cached = $templateCache.get(options.templateUrl);

				if(cached !== undefined){
					tplData = cached;
					processPopup(tplData);
					defer.resolve(cached);
					promise = defer.promise;
				} else {
					promise = $http.get(options.templateUrl)
					.success(function (resp) {
						tplData = $templateCache.put(options.templateUrl, resp);
						processPopup(tplData);
					});
				}

				function processPopup(markup){
					var tTcope = !options.scope ? $rootScope : options.scope;
					var content = $compile(markup)(tTcope);

					options.items = {
						src: content
					};

					tTcope.popupScope = angular.extend({}, options.data);
					tTcope.ok = ok;
					tTcope.cancel = cancel;

					$timeout(function(){
						Popup.open(options);
					},200);

					function ok(){
						var param = tTcope.popupScope.props.btnOkEvent;

						if(angular.isFunction(param)){
							param(arguments);
						} else if(angular.isString(param) && param.length){
							$rootScope.$broadcast(param, tTcope.popupScope.data);
						}
						$timeout(popup.close, options.removeDelay);
					}

					function cancel(){
						var param = tTcope.popupScope.props.btnCancelEvent;

						if(angular.isFunction(param)){
							param();
						} else if(angular.isString(param) && param.length){
							$rootScope.$broadcast(param, tTcope.popupScope.data);
						}
						$timeout(popup.close, options.removeDelay);
					}
				}

				return promise;
			}

			return popup;
		};
	}
})();