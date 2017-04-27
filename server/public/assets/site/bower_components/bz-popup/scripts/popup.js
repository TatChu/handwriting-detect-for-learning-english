var Popup = (function() {
	'use strict';

	var instance;

	function open(params) {
		if (typeof($.magnificPopup) === 'undefined') {
			alert('Popup: magnificPopup not found!');
			return false;
		} else {
			var o = $.extend({
				type: 'inline',
				removeDelay: 200,
				closeOnBg: true,
				alignTop: false,
				preloader: true,
				enableEscapeKey: true,
				showCloseBtn: true,
				closeBtnInside: true,
				modal: false,
				effect: 'bzFromTop',
				overflowY: 'scroll',
				fixedContentPos: 'auto',
				fixedBgPos: true,
				index: null,
				gallery: {
					enabled:true,
					tCounter: '%curr%/%total%'
				},
				beforeOpen: function(){},
				open: function(){},
				beforeClose: function(){},
				close: function(){},
				afterClose: function(){},
				imageLoadComplete: function(){},
				buildControls: function(){},
				callbacks: {
					beforeOpen: function(){
						this.st.mainClass = o.effect;
						if(typeof o.beforeOpen === 'function') o.beforeOpen();
					},
					open: function(){
						if(typeof o.open === 'function') o.open();
					},
					beforeClose: function(){
						if(typeof o.beforeClose === 'function') o.beforeClose();
					},
					close: function(){
						this.wrap.removeClass('mfp-image-loaded');
						if(typeof o.close === 'function') o.close();
					},
					afterClose: function(){
						if(typeof o.afterClose === 'function') o.afterClose();
					},
					imageLoadComplete: function(){
						var self = this;
						setTimeout(function() {
							self.wrap.addClass('mfp-image-loaded');
							if(typeof o.imageLoadComplete === 'function') o.imageLoadComplete();
						}, 16);
					},
					buildControls: function() {
						// try{
						// 	var contaniner = this.contentContainer;
						// 	var arrowLeft = this.arrowLeft;
						// 	var arrowRight = this.arrowRight;
						// 	contaniner.append(arrowLeft.add(arrowRight));
						// 	if(typeof o.buildControls === 'function') o.buildControls();
						// }
						// catch(err){
						// 	throw new Error(err);
						// }
					}
				}
			}, params);

			if(instance){
				instance.close();
			}

			instance = $.magnificPopup.open(o);
		}
	}

	function close(){
		$.magnificPopup.close();
	}

	return {
		open: open,
		close: close
	};
})();