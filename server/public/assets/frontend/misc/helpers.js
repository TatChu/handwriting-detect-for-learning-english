/***************************************************
Description: Helpers
****************************************************/
var helperJs = (function() {
    'use strict';
    return {
        detectScrollDirection: detectScrollDirection,       // Bắt sự kiện scroll lên hoặc scroll xuống
        clearFileInput: clearFileInput,                     // Xóa nội dung input["file"]
        isUndefinedNullEmpty: isUndefinedNullEmpty,         // Kiểm tra dữ liệu
        bzOpenPopup: bzOpenPopup,                           // Xử lý tất cả popup
        bzClosePopup: bzClosePopup,                         // Đóng popup
        getQueryString: getQueryString,                     // Lấy tham số trên URL
        formatMoney: formatMoney,                           // Định dạng đơn vị tiền tệ
        enterFullScreen: enterFullScreen,                   // Bật chế độ xem toàn màn hình
        exitFullScreen: exitFullScreen,                     // Tắt chế độ xem toàn màn hình
        clearLocalStorage: clearLocalStorage,               // Xóa hết storage Cookie
        removeLocalStorage: removeLocalStorage,             // Xóa storage Cookie được chọn
        getLocalStorage: getLocalStorage,                   // Lấy dữ liệu storage Cookie
        setLocalStorage: setLocalStorage,                   // Thêm dữ liệu storage Cookie
        debounce: debounce,                                 // Trì hoãn thực thi hàm khi hoàn thành thao tác
        throttle: throttle,                                 // Trì hoãn thực thi hàm theo thời gian cố định
        hexToRgb: hexToRgb,                                 // Chuyển đổi màu sắc Hex sang RGBA
        preloader: preloader,                               // Các tài nguyên sẽ được tải trước
        scrollToElement: scrollToElement,                   // Tự động cuộn tới đối tượng chỉ định
        scrollToTop: scrollToTop,                           // Tự động cuộn lên trên
        randomRangeFloat: randomRangeFloat,                 // Tạo số thực ngẫu nhiên
        randomRangeInt: randomRangeInt,                     // Tạo số nguyên ngẫu nhiên
        extend: extend,                                      // Kế thừa đối tượng
        renderPopup: renderPopup,
        runSlick: runSlick,
        runSlickIndex: runSlickIndex,
        runSlickDetailProduct: runSlickDetailProduct,
        isNumberKey: isNumberKey,
        select_search: select_search
    };

    function detectScrollDirection(){
        var previousScroll = 0;

        $(window).on('scroll', function(event) {
            var currentScroll = $(this).scrollTop();
            if (currentScroll > previousScroll){
                console.log('down');
            } else {
                console.log('up');
            }
            previousScroll = currentScroll;
        });
    }


    function clearFileInput(obj) {
        obj.replaceWith(obj.val('').clone(true));
    }

    function isUndefinedNullEmpty(data) {
        var output = true;
        if(!isNaN(data)){
            output = false;
        } else if(data === null){
            output = true;
        } else if(data === undefined){
            output = true;
        } else {
            for(var key in data) {
                if(data.hasOwnProperty(key)){
                    output = false;
                }
            }
        }
        return output;
    }
    /******************************************************************
    1. Array
    2. Image
    3. Markup
    *******************************************************************/
    function bzOpenPopup(params) {
        if (typeof($.magnificPopup) === 'undefined') {
            alert('bzPopup: magnificPopup not founOpend!');
            return false;
        } else {
            var o = extend({
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
                        if(typeof o.open === 'function')
                        {
                            $('body').addClass('overflow-hide');
                            o.open();
                        }
                    },
                    beforeClose: function(){
                        if(typeof o.beforeClose === 'function') o.beforeClose();
                    },
                    close: function(){
                        $('body').removeClass('overflow-hide');
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
                        try{
                            var contaniner = this.contentContainer;
                            var arrowLeft = this.arrowLeft;
                            var arrowRight = this.arrowRight;
                            contaniner.append(arrowLeft.add(arrowRight));
                            if(typeof o.buildControls === 'function') o.buildControls();
                        }
                        catch(err){

                        }
                    }
                }
            }, params);

            bzClosePopup();

            $.magnificPopup.open(o);
        }
    }



    function bzClosePopup(){
        $.magnificPopup.close();
    }

    function getQueryString(url, name) {
        var a = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regexS = '[\\?&]' + a + '=([^&#]*)';
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        if (results === null) return '';
        else return decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    function formatMoney(number, places, symbol, thousand, decimal) {
        number = number || 0;
        places = !isNaN(places = Math.abs(places)) ? places : 0;
        symbol = symbol !== undefined ? symbol : '';
        thousand = thousand || '.';
        decimal = decimal || ',';
        var negative = number < 0 ? '-' : '',
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + '',
        j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '');
    }

    function enterFullScreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function exitFullScreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }


    function clearLocalStorage() {
        localStorage.clear();
    }

    function removeLocalStorage(name) {
        localStorage.removeItem(name);
    }

    function getLocalStorage(name) {
        var date = new Date(),
        current = Math.round(+date / 1000),
        storedData = JSON.parse(localStorage.getItem(name)) || {},
        storedTime = storedData.storageExpireTime || 0;

        if (storedTime && storedTime < current) {
            removeLocalStorage(name);
            return undefined;
        } else {
            return storedData.store;
        }
    }

    function setLocalStorage(name, value, seconds) {
        var date = new Date(),
        schedule = Math.round((date.setSeconds(date.getSeconds() + seconds)) / 1000),
        data = JSON.stringify({storageExpireTime: schedule, store: value});
        try {
            localStorage.setItem(name, data);
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
                alert('Quota exceeded!');
            }
        }

        return data;
    }

    function debounce(fn, ms) {
        var timer = null;
        return function() {
            var context = this,
            args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, ms);
        };
    }

    function throttle(fn, ms, scope) {
        ms || (ms = 250);
        var last,
        deferTimer;
        return function () {
            var context = scope || this;

            var now = +new Date,
            args = arguments;
            if (last && now < last + ms) {
                clearTimeout(deferTimer);
                deferTimer = setTimeout(function () {
                    last = now;
                    fn.apply(context, args);
                }, ms);
            } else {
                last = now;
                fn.apply(context, args);
            }
        };
    }

    function hexToRgb(hex, opacity){
        var h = hex.replace('#', '');
        h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

        for(var i=0; i<h.length; i++){
            h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);
        }

        if (typeof opacity != 'undefined') {
            h.push(opacity);
        }

        return 'rgba('+h.join(',')+')';
    }

    function preloader(fileList, callback){
        var loaded = 0;
        var len = fileList.length;
        if(len){
            for (var i = 0; i < len; i++) {
                var img = new Image();
                img.src = fileList[i];
                img.onload = function(event){
                    check(len);
                    console.info('File loaded: ', event.target.currentSrc);
                };

                img.onerror = function(event){
                    check(len);
                    console.info('Cannot load file: ', event.target.currentSrc);
                };
            };
        } else {
            complete();
        }

        function check(count){
            loaded++;
            if(loaded === count){
                complete();
            }
        }

        function complete(){
            if(typeof callback === 'function'){
                callback();
            }
        }
    }

    function scrollToElement(selector, time, verticalOffset) {
        time = typeof(time) !== 'undefined' ? time : 1000;
        verticalOffset = typeof(verticalOffset) !== 'undefined' ? verticalOffset : 0;
        var offset = $(selector).offset();
        var offsetTop = offset.top + verticalOffset;
        $('html,body,.view-container').animate({ scrollTop: offsetTop }, time);
    }

    function scrollToTop(time) {
        time = typeof(time) !== 'undefined' ? time : 1000;
        $('html,body,.view-container').animate({ scrollTop: 0 }, time);
    }

    function randomRangeFloat(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    function randomRangeInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function extend(a, b){
        for(var key in b){
            if(b.hasOwnProperty(key)){
                a[key] = b[key];
            }
        }
        return a;
    }

    function slider(ele) {
        $(ele).slick({
          infinite: false,
          speed: 300,
          slidesToShow: 4,
          slidesToScroll: 4
        });
    }
    function slider_nav(page, listClass, viewClass) {
        $(page).find(viewClass).slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            fade: true,
            asNavFor: listClass,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    dots: true,
                    vertical: false
                }
            }
            ]
        });
        $(page).find(listClass).slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            arrows: true,
            vertical: true,
            focusOnSelect: true,
            asNavFor: viewClass,

            autoplaySpeed: 5000,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            }
            ]
        });
    }

    function fancybox() {
        $('.fancybox').fancybox({
            prevEffect      : 'none',
            nextEffect      : 'none',
        });
    }
    function renderPopup() {
        runSlick("#pop-detail .list-product .row");
        runSlickDetailProduct("#pop-detail",".list-image", ".view-image");
        var bLazy;
        setTimeout(function(){
            bLazy   = new Blazy({
                container: '#pop-detail .list-product .row'
            }); 
        }, 1000);
        $('#pop-detail .list-product .row').on('afterChange', function(event, slick, direction){
          bLazy.revalidate();
        });
        fancybox();
    }

    function runSlick(argument) {
        var screen_w = $(window).width();
        if(screen_w > 767)
            slider(argument);
    }

    function runSlickIndex(argument) {        
        $(argument).slick({
          infinite: false,
          speed: 300,
          slidesToShow: 1,
          slidesToScroll: 1,
          prevArrow: "none",
          nextArrow: "none"
        });
    }
    function runSlickDetailProduct(page, listClass, viewClass) {
        slider_nav(page, listClass, viewClass);
    }

    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;
        return true;
    }
    function select_search(){
    // do dai bang so text goi y + so san pham goi y
    var num = $("#header .search .searching .text a").length/2 + $("#header .search .searching .show-items .item").length/2,
        num_a = $("#header .search .searching .text a").length/2,
        num_item =  $("#header .search .searching .item").length/2,
        index = -1,
        text_search;
    if(num > 0)
    {
      //khi nhan phim trong box search
      $("#header .search input[type=text]").keyup(function(e){
        //neu la phim xuong
        if (e.keyCode == 40) 
        {  
          //index tang het thi dung tang nua
          if(index < num - 1)
            index++;
          //select text goi y
          if(index < num_a)
          {
            $("#header .search .searching .text a").removeClass('selected_item');
            $("#header .search .searching .text a").eq(index).addClass('selected_item');
            $("#header .search.show-mb .searching .text a").eq(index).addClass('selected_item');
            text_search = $("#header .search .searching .text a").eq(index).html();
          }
          //select item goi y
          else 
          {
            $("#header .search .searching .text a").removeClass('selected_item');
            $("#header .search .searching .show-items .item").removeClass('selected_item');
            $("#header .search .searching .show-items .item").eq(index - num_a).addClass('selected_item');
            $("#header .search.show-mb .searching .show-items .item").eq(index - num_a).addClass('selected_item');
            text_search = $("#header .search .searching .show-items .item .name").eq(index - num_a).html();

          }
          //gan text cho the input
          $(this)[0].value = text_search;

        }
        //an nut len
        if(e.keyCode==38)
        {
          //index giam xuong 0 thi dung giam nua
          if(index > 0)
            index--;
          //select text goi y
          if(index < num_a)
          {
            $("#header .search .searching .text a").removeClass('selected_item');
            $("#header .search .searching .show-items .item").removeClass('selected_item');
            $("#header .search .searching .text a").eq(index).addClass('selected_item');
            $("#header .search.show-mb .searching .text a").eq(index).addClass('selected_item');
            text_search = $("#header .search .searching .text a").eq(index).html();

          }
          //select item goi y
          else 
          {
            $("#header .search .searching .show-items .item").removeClass('selected_item');
            $("#header .search .searching .show-items .item").eq(index - num_a).addClass('selected_item');
            $("#header .search.show-mb .searching .show-items .item").eq(index - num_a).addClass('selected_item');
            text_search = $("#header .search .searching .show-items .item .name").eq(index - num_a).html();
          }
          //gan text cho the input
          $(this)[0].value = text_search;
        }
      });
    }
  }
})();
