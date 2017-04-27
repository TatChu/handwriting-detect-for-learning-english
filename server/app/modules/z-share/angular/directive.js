(function () {
    'use strict';
    angular
        .module('bzApp')

        .directive('bzColorPicker', bzColorPicker)
        .directive('autogrow', autogrow)
        .directive('ckEditor', ckEditor)
        .directive('bzInputMask', bzInputMask)
        .directive('bzLoadingProgress', bzLoadingProgress)
        .directive('bzPlaceholder', bzPlaceholder)
        .directive('bzFileModel', bzFileModel)
        .directive('bzInputControls', bzInputControls)                         // Sự kiện cuộn chuột giữa và nhấn phím mũi tên
        .directive('bzValidPasswordMatch', bzValidPasswordMatch)               // Kiểm tra mật khẩu trùng khớp
        .directive('bzValidPassword', bzValidPassword)                         // Kiểm tra độ an toàn của mật khẩu
        .directive('bzPasswordStrength', bzPasswordStrength)                   // Kiểm tra mật khẩu (Ký tự đặc biệt, in hoa, thường, ký tự số)
        .directive('bzWordCount', bzWordCount)                                 // Giới hạn số từ được nhập
        .directive('bzValidExist', bzValidExist)                               // Kiểm tra dữ liệu trong database
        .directive('bzValidFileInput', bzValidFileInput)                       // Kiểm tra tập tin upload
        .directive('bzSubmit', bzSubmit)                                       // Nút submit có trạng thái loading
        .directive('bzPageTransition', bzPageTransition)                       // Hiệu ứng chuyển trang
        .directive('bzTimePicker', bzTimePicker)                               // Popup chọn thời gian
        .directive('bzDatePicker', bzDatePicker)                               // Popup chọn ngày
        .directive('bzDateTimePicker', bzDateTimePicker)                       // Popup chọn ngày
        .directive('bzDateRangePicker', bzDateRangePicker)                     // Popup chọn ngày
        .directive('bzMedia', bzMedia)                                         // Điều khiển HTML5 Audio, video
        .directive('bzLoading', bzLoading)                                     // Trạng thái loading
        .directive('bzCustomScrollbar', bzCustomScrollbar)                     // Giao diện scrollbar
        .directive('bzRepeatCompleted', bzRepeatCompleted)                     // Sự kiện khi ng-repeat hoàn thành
        .directive('bzPager', bzPager)                                         // Tạo phân trang cho dữ liệu
        .directive('bzParallax', bzParallax)                                   // Hiệu ứng parallax
        .directive('bzFancybox', bzFancybox)                                   // Lightbox
        .directive('bzInfinityScroll', bzInfinityScroll)
        .directive('bzFullframe', bzFullframe)
        .directive('bzTag', bzTag)
        .directive('bzInputNumber', bzInputNumber)
        .directive('bzCheckDate', bzCheckDate)
        .directive('iCheck', iCheck)
        .directive('atrDateTimePicker', atrDateTimePicker)
        .directive('singleDateTimePicker', singleDateTimePicker)               //Single date time by xuantoan
        .directive('bzCropper', bzCropper)
        .directive('bzInputOnlyDigits', bzInputOnlyDigits);
    // .directive('bzInputMatch', bzInputMatch);

    /*Icheck vu.dev@antoree.com*/
    function iCheck($timeout, $parse) {
        return {
            require: 'ngModel',
            // scope: {
            //     checkboxClass: '=checkboxClass'
            // },
            link: function ($scope, element, $attrs, ngModel) {
                return $timeout(function () {
                    var checkboxClass = $attrs['checkboxClass'];
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function (newValue) {
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        // checkboxClass: 'icheckbox_square',
                        radioClass: 'iradio_square-blue',
                        checkboxClass: checkboxClass || 'icheckbox_square-blue',
                        increaseArea: '20%'

                    }).on('ifChanged', function (event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function () {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function () {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    }
    /*End Icheck vu.dev@antoree.com*/

    /*DateTime vu.dev@antoree.com*/
    function atrDateTimePicker() {
        return {
            require: 'ngModel',
            scope: {
                atrOptions: '=atrOptions'
            },
            link: function (scope, element, $attrs, ngModel) {
                /*Init date time*/
                var options = {
                    timePicker: false,          /* có time*/
                    timePickerIncrement: 30,    /* khoảng phút của time*/
                    singleDatePicker: true,     /*range*/
                    autoUpdateInput: false,
                    locale: {
                        format: 'DD/MM/YYYY'
                    }
                };
                options = angular.extend({}, options, scope.atrOptions);

                element.daterangepicker(options);
                /*Khi date thay đổi*/
                element.on('apply.daterangepicker', function (ev, picker) {
                    var value = {
                        startDate: picker.startDate,
                        endDate: picker.endDate,
                    };

                    /*khi chọn single, mutil datetime*/
                    if (!options.singleDatePicker) {
                        picker.element.val(picker.startDate.format(picker.locale.format) + ' - ' + picker.endDate.format(picker.locale.format));
                        return ngModel.$setViewValue(value);
                    } else {
                        picker.element.val(picker.startDate.format(picker.locale.format));
                        return ngModel.$setViewValue(value.startDate);
                    }
                });

                /*Render lần đầu vào page model trc khi init datetime*/
                if (!ngModel) return;
                ngModel.$render = function () {
                    if (ngModel.$viewValue) {
                        var convertedDate = moment(ngModel.$viewValue).format(options.locale.format);
                        element.val(convertedDate || '');
                    }
                };
            }
        };
    }


    /*End DateTime vu.dev@antoree.com*/

    /*Start: DateTime for single date xuantoancth541994@gmail.com*/

    // Only use for select single datetime picker
    function singleDateTimePicker($timeout) {
        return {
            require: 'ngModel',
            scope: {
                atrOptions: '=atrOptions'
            },
            link: function (scope, element, $attrs, ngModel) {
                /*Init date time*/
                var options = {
                    timePicker: false,          /* có time*/
                    timePickerIncrement: 30,    /* khoảng phút của time*/
                    singleDatePicker: true,     /*range*/
                    autoUpdateInput: false,
                    locale: {
                        format: 'DD/MM/YYYY'
                    }
                };
                options = angular.extend({}, options, scope.atrOptions);

                $timeout(function () {
                    element.daterangepicker(options);
                    /*Khi date thay đổi*/
                    element.on('apply.daterangepicker', function (ev, picker) {
                        var value = {
                            startDate: picker.startDate,
                            endDate: picker.endDate,
                        };

                        picker.element.val(picker.startDate.format(picker.locale.format));
                        return ngModel.$setViewValue(value.startDate);
                    });

                    /*Render lần đầu vào page model trc khi init datetime*/
                    if (!ngModel) return;
                    ngModel.$render = function () {
                        if (ngModel.$viewValue) {
                            var convertedDate = moment(ngModel.$viewValue).format(options.locale.format);
                            element.val(convertedDate || '');
                        }
                    };
                }, 10);
            }
        };
    }
    /*Start: DateTime for single date xuantoancth541994@gmail.com*/



    function bzColorPicker($timeout) {
        return {
            require: 'ngModel',
            scope: {
                modelValue: '=ngModel'
            },
            link: function (scope, iElement, iAttr, ngModel) {
                $timeout(function () {
                    var a = iElement.colorpicker({
                        color: scope.modelValue
                    });

                    a.on('changeColor', function (data) {
                        scope.$apply(function () {
                            ngModel.$setViewValue(data.color.toString());
                        });
                    });
                });
            }
        };
    }

    function autogrow($timeout, $window) {
        return {
            link: function (scope, iElement, iAttr) {
                process(0);

                scope.$on('bz:redrawAutogrow', function () {
                    process(100);
                });

                function process(ms) {
                    $timeout(function () {
                        autosize(iElement);
                    }, ms);
                }
            }
        }
    }

    function ckEditor($timeout) {
        return {
            require: '?ngModel',
            transclude: true,
            restrict: 'A',
            link: function (scope, iElement, iAttrs, ngModel) {
                var editor, updateModel;

                $timeout(function () {
                    editor = CKEDITOR.replace(iElement[0], {});
                    if (!ngModel) {
                        return;
                    }

                    editor.on('instanceReady', function () {
                        return editor.setData(ngModel.$viewValue);
                    });
                    editor.on('change', updateModel);
                    editor.on('dataReady', updateModel);
                    editor.on('key', updateModel);
                    editor.on('paste', updateModel);
                    editor.on('selectionChange', updateModel);

                    function updateModel() {
                        return scope.$apply(function () {
                            return ngModel.$setViewValue(editor.getData());
                        });
                    };

                    return ngModel.$render = function () {
                        return editor.setData(ngModel.$viewValue);
                    };
                });
            }
        };
    }

    function bzInputMask() {
        return {
            link: function (scope, iElement, iAttrs) {
                var mask = scope.$eval(iAttrs.bzInputMask);
                Inputmask(mask).mask(iElement[0]);
            }
        };
    }

    function bzLoadingProgress() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div id="bz-progressbar">' +
            '<div></div>' +
            '</div>',
            link: function (scope, iElement, iAttrs) {
                scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    setTimeout(function () {
                        iElement.find('>div').css('width', 0);
                        iElement.fadeIn(200);
                    }, 500);

                    run(0);

                    function run(value) {
                        setTimeout(function () {
                            if (value < 90) {
                                var randomVal = helperJs.randomRangeInt(value, value + 10);
                                iElement.find('>div').css('width', randomVal + '%');
                                value += randomVal;
                                run(value);
                            }
                        }, helperJs.randomRangeInt(200, 500));
                    }
                });

                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    iElement.find('>div').css('width', '100%');
                    setTimeout(function () {
                        iElement.fadeOut(200);
                    }, 500);
                });
            }
        };
    }

    function bzPlaceholder() {
        return {
            replace: true,
            transclude: true,
            template: '<div>' +
            '<img ng-src="{{icon}}" />' +
            '<span>{{caption}}</span>' +
            '</div>',
            link: function (scope, iElement, iAttrs) {
                var input = angular.element(iAttrs.for);
                scope.caption = iAttrs.caption;
                scope.icon = iAttrs.icon;

                iElement.on('click', function (event) {
                    iElement.hide();
                    input.focus();
                });

                input.on('focus', function (event) {
                    iElement.hide();
                });

                input.on('blur', function (event) {
                    var val = input.val();

                    if (!val.length) {
                        iElement.show();
                    }
                });
            }
        };
    }

    function bzFileModel($parse) {
        return {
            link: function (scope, iElement, iAttrs) {
                var model = $parse(iAttrs.bzFileModel);
                var modelSetter = model.assign;

                iElement.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, iElement[0].files);
                    });
                });
            }
        };
    }

    function bzInputControls($state, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                var len = settingJs.pageTransitionSequence.length - 1,
                    currentPage = '',
                    direction = '',
                    currentIdx = 0;

                scope.allowInputControls = true;

                scope.$on('bz:allowInputControls', function (event, data) {
                    scope.allowInputControls = data;
                });

                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    currentPage = toState.name;
                    currentIdx = settingJs.pageTransitionSequence.getIndexBy('stateName', currentPage);

                    $timeout(function () {
                        scope.allowInputControls = true;
                    }, settingJs.pageTransitionDelay);
                });

                iElement.on('keydown', function (event) {
                    currentPage = $state.current.name;
                    if (event.keyCode === 38 || event.keyCode === 39) {
                        direction = 'down';
                        gotoPage(currentPage, direction);
                    }
                    if (event.keyCode === 37 || event.keyCode === 40) {
                        direction = 'up';
                        gotoPage(currentPage, direction);
                    }
                });

                iElement.mousewheel(function (event, delta, deltaX, deltaY) {
                    direction = delta > 0 ? 'down' : 'up';
                    gotoPage(currentPage, direction);
                });

                function gotoPage(page, dir) {
                    if (scope.allowInputControls) {
                        scope.allowInputControls = false;
                        if (dir === 'up') {
                            currentIdx++;
                        } else {
                            currentIdx--;
                        }
                        if (settingJs.pageTransitionLoop) {
                            if (currentIdx > len) currentIdx = 0;
                            if (currentIdx < 0) currentIdx = len;
                        } else {
                            if (currentIdx > len) currentIdx = len;
                            if (currentIdx < 0) currentIdx = 0;
                            $timeout(function () {
                                scope.allowInputControls = true;
                            }, settingJs.pageTransitionDelay);
                        }
                        $state.go(settingJs.pageTransitionSequence[currentIdx].stateName);
                    }
                }
            }
        };
    }

    function bzValidPasswordMatch() {
        return {
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ngModel) {
                var pw = $(iAttrs.bzValidPasswordMatch);

                ngModel.$parsers.push(function (value) {
                    ngModel.$setValidity('match', value !== '' && value === pw[0].value);
                    return value;
                });
            }
        };
    }

    function bzPasswordStrength() {
        return {
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ngModel) {
                var PASSWORD_PATTERN = [/[^\w\s]+/, /[A-Z]+/, /\w+/, /\d+/];
                var element = $(iAttrs.bzPasswordStrength);

                iElement.on('focus', function (event) {
                    element.show();
                });

                iElement.on('blur', function (event) {
                    element.hide();
                });

                ngModel.$parsers.push(function (value) {
                    var level = 0;
                    if (value.length >= 8) {
                        angular.forEach(PASSWORD_PATTERN, function (regex) {
                            if (regex.test(value)) {
                                level++;
                            }
                        });
                        scope.passwordStrength = level;
                    }
                });
            }
        };
    }

    function bzWordCount() {
        return {
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ngModel) {
                var maxW = parseInt(iAttrs.maxWords);
                var minW = parseInt(iAttrs.minWords) || 0;
                var wordCount = 0;

                ngModel.$parsers.push(function (value) {
                    wordCount = value.trim().replace(/(\r\n|\n|\r)/gm, ' ').replace(/\.\s+/g, ' ').split(' ').length;
                    ngModel.$setValidity('mixwords', wordCount >= minW);
                    ngModel.$setValidity('maxwords', wordCount <= maxW);
                    return value;
                });
            }
        };
    }

    function bzValidExist($resource) {
        return {
            require: 'ngModel',
            scope: {
                bzValidExist: '='
            },
            link: function (scope, iElement, iAttrs, ngModel) {
                var data = scope.bzValidExist;
                iElement.on('focus', function (event) {
                    $(data.selector).hide();
                });

                iElement.on('blur', function (event) {
                    data.value = ngModel.$viewValue;
                    var User = $resource(data.url);
                    var userInfo = new User(data);

                    userInfo.$save(function (resp) {
                        //ngModel.$setValidity('recordexist', !resp.status);
                        if (resp.status) {
                            $(data.selector).show();
                        }
                    });

                    scope.$apply();
                });
            }
        };
    }

    function bzValidPassword() {
        var PASSWORD_FORMATS = [/[^\w\s]+/, /[A-Z]+/, /\w+/, /\d+/];
        return {
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    var status = true;

                    angular.forEach(PASSWORD_FORMATS, function (regex) {
                        status = status && regex.test(value);
                    });

                    ngModel.$setValidity('passwordcharacters', status);
                    return value;
                });
            }
        };
    }

    function bzValidFileInput($parse) {
        return {
            require: 'ngModel',
            link: function (scope, iElement, iAttrs, ngModel) {
                var fileSelected = [],
                    fileSize = iAttrs.fileSize,
                    fileType = iAttrs.fileType.split(',');

                var model = $parse(iAttrs.ngModel);
                var modelSetter = model.assign;

                scope.$on('bz:clearFileInput', function () {
                    ngModel.$setViewValue(null);
                    ngModel.$render();
                    iElement.val('');
                });

                iElement.on('change', function () {
                    scope.$apply(function () {
                        fileSelected = iElement[0].files;
                        modelSetter(scope, iElement[0].files);

                        customValidator(iElement.val());
                    });
                });

                function customValidator(value) {
                    var ouputSize = [];
                    var ouputType = [];

                    for (var i = 0; i < fileSelected.length; i++) {
                        if (fileSelected[i].size > fileSize) {
                            ouputSize.push(fileSelected[i]);
                        }
                        if (fileType.indexOf(fileSelected[i].type) === -1) {
                            ouputType.push(fileSelected[i]);
                        }
                    }

                    ngModel.$setValidity('filesize', ouputSize.length === 0);
                    ngModel.$setValidity('filetype', ouputType.length === 0);

                    return value;
                }
            }
        };
    }

    function bzSubmit() {
        return {
            replace: true,
            transclude: true,
            template: '<button>' +
            '<ng-transclude></ng-transclude>' +
            '<div class="circle animFade" ng-if="type===\'circle\'"></div>' +
            '<div class="bar animFade" ng-if="type===\'bar\'">' +
            '<div class="rect1"></div>' +
            '<div class="rect2"></div>' +
            '<div class="rect3"></div>' +
            '</div>' +
            '</button>',
            link: function (scope, iElement, iAttrs) {
                scope.type = iAttrs.loadingIcon || 'circle';
            }
        };
    }

    function bzPageTransition($animate, bzValueSvc) {
        return {
            link: function (scope, iElement, iAttrs) {
                var inClass = '', outClass = '';
                var curAnim = iAttrs.bzPageTransition.split(',');

                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    var uiView = $('.mainView');

                    if (bzValueSvc.loadCounter > 1) {
                        if (is.desktop()) {
                            var animFrom = 0, animTo = 0;

                            if (toState.name === fromState.name) {
                                animData(0);
                                uiView.eq(0).addClass(inClass);
                                uiView.eq(1).addClass(outClass);
                            } else {
                                for (var i = 0; i < settingJs.pageTransitionSequence.length; i++) {
                                    if (settingJs.pageTransitionSequence[i].stateName === fromState.name) {
                                        animFrom = i;
                                    }
                                    if (settingJs.pageTransitionSequence[i].stateName === toState.name) {
                                        animTo = i;
                                    }
                                }

                                uiView.removeClass(inClass + ' ' + outClass);

                                // Next
                                if (animFrom < animTo) {
                                    animData(parseInt(curAnim[0]));
                                    uiView.eq(0).addClass(inClass);
                                    uiView.eq(1).addClass(outClass);
                                }
                                // Prev
                                if (animFrom > animTo) {
                                    animData(parseInt(curAnim[1]));
                                    uiView.eq(0).addClass(inClass);
                                    uiView.eq(1).addClass(outClass);
                                }
                            }
                        }

                        $animate.on('enter', uiView.eq(0), function (element, phase) {
                            if (phase === 'close') {
                                scope.$broadcast('bz:pageTransitionCompleted', '');
                            }
                        });
                    } else {
                        animData(0);
                        uiView.eq(0).addClass(inClass);
                        uiView.eq(1).addClass(outClass);
                    }
                });

                function animData(index) {
                    switch (index) {
                        case 0:
                            outClass = 'pt-page-fadeOut';
                            inClass = 'pt-page-fadeIn';
                            break;
                        case 1:
                            outClass = 'pt-page-moveToLeft';
                            inClass = 'pt-page-moveFromRight';
                            break;
                        case 2:
                            outClass = 'pt-page-moveToRight';
                            inClass = 'pt-page-moveFromLeft';
                            break;
                        case 3:
                            outClass = 'pt-page-moveToTop';
                            inClass = 'pt-page-moveFromBottom';
                            break;
                        case 4:
                            outClass = 'pt-page-moveToBottom';
                            inClass = 'pt-page-moveFromTop';
                            break;
                        case 5:
                            outClass = 'pt-page-fade';
                            inClass = 'pt-page-moveFromRight pt-page-ontop';
                            break;
                        case 6:
                            outClass = 'pt-page-fade';
                            inClass = 'pt-page-moveFromLeft pt-page-ontop';
                            break;
                        case 7:
                            outClass = 'pt-page-fade';
                            inClass = 'pt-page-moveFromBottom pt-page-ontop';
                            break;
                        case 8:
                            outClass = 'pt-page-fade';
                            inClass = 'pt-page-moveFromTop pt-page-ontop';
                            break;
                        case 9:
                            outClass = 'pt-page-moveToLeftFade';
                            inClass = 'pt-page-moveFromRightFade';
                            break;
                        case 10:
                            outClass = 'pt-page-moveToRightFade';
                            inClass = 'pt-page-moveFromLeftFade';
                            break;
                        case 11:
                            outClass = 'pt-page-moveToTopFade';
                            inClass = 'pt-page-moveFromBottomFade';
                            break;
                        case 12:
                            outClass = 'pt-page-moveToBottomFade';
                            inClass = 'pt-page-moveFromTopFade';
                            break;
                        case 13:
                            outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
                            inClass = 'pt-page-moveFromRight';
                            break;
                        case 14:
                            outClass = 'pt-page-moveToRightEasing pt-page-ontop';
                            inClass = 'pt-page-moveFromLeft';
                            break;
                        case 15:
                            outClass = 'pt-page-moveToTopEasing pt-page-ontop';
                            inClass = 'pt-page-moveFromBottom';
                            break;
                        case 16:
                            outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
                            inClass = 'pt-page-moveFromTop';
                            break;
                        case 17:
                            outClass = 'pt-page-scaleDown';
                            inClass = 'pt-page-moveFromRight pt-page-ontop';
                            break;
                        case 18:
                            outClass = 'pt-page-scaleDown';
                            inClass = 'pt-page-moveFromLeft pt-page-ontop';
                            break;
                        case 19:
                            outClass = 'pt-page-scaleDown';
                            inClass = 'pt-page-moveFromBottom pt-page-ontop';
                            break;
                        case 20:
                            outClass = 'pt-page-scaleDown';
                            inClass = 'pt-page-moveFromTop pt-page-ontop';
                            break;
                        case 21:
                            outClass = 'pt-page-scaleDown';
                            inClass = 'pt-page-scaleUpDown pt-page-delay300';
                            break;
                        case 22:
                            outClass = 'pt-page-scaleDownUp';
                            inClass = 'pt-page-scaleUp pt-page-delay300';
                            break;
                        case 23:
                            outClass = 'pt-page-moveToLeft pt-page-ontop';
                            inClass = 'pt-page-scaleUp';
                            break;
                        case 24:
                            outClass = 'pt-page-moveToRight pt-page-ontop';
                            inClass = 'pt-page-scaleUp';
                            break;
                        case 25:
                            outClass = 'pt-page-moveToTop pt-page-ontop';
                            inClass = 'pt-page-scaleUp';
                            break;
                        case 26:
                            outClass = 'pt-page-moveToBottom pt-page-ontop';
                            inClass = 'pt-page-scaleUp';
                            break;
                        case 27:
                            outClass = 'pt-page-scaleDownCenter';
                            inClass = 'pt-page-scaleUpCenter pt-page-delay400';
                            break;
                        case 28:
                            outClass = 'pt-page-rotateRightSideFirst';
                            inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
                            break;
                        case 29:
                            outClass = 'pt-page-rotateLeftSideFirst';
                            inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
                            break;
                        case 30:
                            outClass = 'pt-page-rotateTopSideFirst';
                            inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
                            break;
                        case 31:
                            outClass = 'pt-page-rotateBottomSideFirst';
                            inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
                            break;
                        case 32:
                            outClass = 'pt-page-flipOutRight';
                            inClass = 'pt-page-flipInLeft pt-page-delay500';
                            break;
                        case 33:
                            outClass = 'pt-page-flipOutLeft';
                            inClass = 'pt-page-flipInRight pt-page-delay500';
                            break;
                        case 34:
                            outClass = 'pt-page-flipOutTop';
                            inClass = 'pt-page-flipInBottom pt-page-delay500';
                            break;
                        case 35:
                            outClass = 'pt-page-flipOutBottom';
                            inClass = 'pt-page-flipInTop pt-page-delay500';
                            break;
                        case 36:
                            outClass = 'pt-page-rotateFall pt-page-ontop';
                            inClass = 'pt-page-scaleUp';
                            break;
                        case 37:
                            outClass = 'pt-page-rotateOutNewspaper';
                            inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
                            break;
                        case 38:
                            outClass = 'pt-page-rotatePushLeft';
                            inClass = 'pt-page-moveFromRight';
                            break;
                        case 39:
                            outClass = 'pt-page-rotatePushRight';
                            inClass = 'pt-page-moveFromLeft';
                            break;
                        case 40:
                            outClass = 'pt-page-rotatePushTop';
                            inClass = 'pt-page-moveFromBottom';
                            break;
                        case 41:
                            outClass = 'pt-page-rotatePushBottom';
                            inClass = 'pt-page-moveFromTop';
                            break;
                        case 42:
                            outClass = 'pt-page-rotatePushLeft';
                            inClass = 'pt-page-rotatePullRight pt-page-delay180';
                            break;
                        case 43:
                            outClass = 'pt-page-rotatePushRight';
                            inClass = 'pt-page-rotatePullLeft pt-page-delay180';
                            break;
                        case 44:
                            outClass = 'pt-page-rotatePushTop';
                            inClass = 'pt-page-rotatePullBottom pt-page-delay180';
                            break;
                        case 45:
                            outClass = 'pt-page-rotatePushBottom';
                            inClass = 'pt-page-rotatePullTop pt-page-delay180';
                            break;
                        case 46:
                            outClass = 'pt-page-rotateFoldLeft';
                            inClass = 'pt-page-moveFromRightFade';
                            break;
                        case 47:
                            outClass = 'pt-page-rotateFoldRight';
                            inClass = 'pt-page-moveFromLeftFade';
                            break;
                        case 48:
                            outClass = 'pt-page-rotateFoldTop';
                            inClass = 'pt-page-moveFromBottomFade';
                            break;
                        case 49:
                            outClass = 'pt-page-rotateFoldBottom';
                            inClass = 'pt-page-moveFromTopFade';
                            break;
                        case 50:
                            outClass = 'pt-page-moveToRightFade';
                            inClass = 'pt-page-rotateUnfoldLeft';
                            break;
                        case 51:
                            outClass = 'pt-page-moveToLeftFade';
                            inClass = 'pt-page-rotateUnfoldRight';
                            break;
                        case 52:
                            outClass = 'pt-page-moveToBottomFade';
                            inClass = 'pt-page-rotateUnfoldTop';
                            break;
                        case 53:
                            outClass = 'pt-page-moveToTopFade';
                            inClass = 'pt-page-rotateUnfoldBottom';
                            break;
                        case 54:
                            outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
                            inClass = 'pt-page-rotateRoomLeftIn';
                            break;
                        case 55:
                            outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
                            inClass = 'pt-page-rotateRoomRightIn';
                            break;
                        case 56:
                            outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
                            inClass = 'pt-page-rotateRoomTopIn';
                            break;
                        case 57:
                            outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
                            inClass = 'pt-page-rotateRoomBottomIn';
                            break;
                        case 58:
                            outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
                            inClass = 'pt-page-rotateCubeLeftIn';
                            break;
                        case 59:
                            outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
                            inClass = 'pt-page-rotateCubeRightIn';
                            break;
                        case 60:
                            outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
                            inClass = 'pt-page-rotateCubeTopIn';
                            break;
                        case 61:
                            outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
                            inClass = 'pt-page-rotateCubeBottomIn';
                            break;
                        case 62:
                            outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
                            inClass = 'pt-page-rotateCarouselLeftIn';
                            break;
                        case 63:
                            outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
                            inClass = 'pt-page-rotateCarouselRightIn';
                            break;
                        case 64:
                            outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
                            inClass = 'pt-page-rotateCarouselTopIn';
                            break;
                        case 65:
                            outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
                            inClass = 'pt-page-rotateCarouselBottomIn';
                            break;
                        case 66:
                            outClass = 'pt-page-rotateSidesOut';
                            inClass = 'pt-page-rotateSidesIn pt-page-delay200';
                            break;
                        case 67:
                            outClass = 'pt-page-rotateSlideOut';
                            inClass = 'pt-page-rotateSlideIn';
                            break;
                    }
                }
            }
        };
    }

    function bzTimePicker($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs, ngModel) {
                iElement.timepicker();
            }
        };
    }

    function bzDatePicker() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, iElement, iAttrs, ngModel) {
                if (!ngModel) return;

                ngModel.$render = function () {
                    if (ngModel.$viewValue) {
                        var convertedDate = moment(ngModel.$viewValue).format('DD/MM/YYYY');
                        iElement.val(convertedDate || '');
                    }
                };

                iElement.on('blur keyup change', function () {
                    scope.$evalAsync(read);
                });

                read();

                function read() {
                    var date = iElement.val();
                    var convertedDate = moment(date, 'DD/MM/YYYY').toDate();
                    ngModel.$setViewValue(convertedDate);
                }

                iElement.datepicker({
                    dateFormat: 'dd/mm/yy',
                    changeMonth: true,
                    changeYear: true,
                    beforeShow: function () {
                        setTimeout(function () {
                            $('.ui-datepicker').css('z-index', 1050);
                        }, 0);
                    },
                    onSelect: function (date, data) {
                        scope.$evalAsync(read);
                    }
                });
            }
        };
    }

    function bzDateTimePicker($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs, ngModel) {
                iElement.datetimepicker({
                    dateFormat: 'dd/mm/yy',
                    timeFormat: 'HH:mm:ss',
                    changeMonth: true,
                    changeYear: true,
                    showTime: false,
                    beforeShow: function () {
                        setTimeout(function () {
                            $('.ui-datepicker').css('z-index', 1050);
                        }, 0);
                    },
                });
            }
        };
    }

    function bzDateRangePicker($timeout) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, iElement, iAttrs, ngModel) {
                //$timeout(function(){
                var txtStateDate = iElement.find('#dpFrom');
                var txtEndDate = iElement.find('#dpTo');

                console.log(txtStateDate)

                txtStateDate.datetimepicker({
                    dateFormat: 'dd/mm/yy',
                    timeFormat: 'HH:mm:ss',
                    changeMonth: true,
                    changeYear: true,
                    beforeShow: function () {
                        setTimeout(function () {
                            $('.ui-datepicker').css('z-index', 1050);
                        }, 0);
                    },
                    onClose: function (dateText, inst) {
                        // if (txtEndDate.val() != '') {
                        //     var testStartDate = txtStateDate.datetimepicker('getDate');
                        //     var testEndDate = txtEndDate.datetimepicker('getDate');
                        //     if (testStartDate > testEndDate)
                        //         txtEndDate.datetimepicker('setDate', testStartDate);
                        // }
                        // else {
                        //     txtEndDate.val(dateText);
                        // }
                    },
                    onSelect: function (selectedDateTime) {
                        txtEndDate.datetimepicker('option', 'minDate', txtStateDate.datetimepicker('getDate'));
                        txtStateDate.datepicker("hide");
                    }
                });
                txtEndDate.datetimepicker({
                    dateFormat: 'dd/mm/yy',
                    timeFormat: 'HH:mm:ss',
                    changeMonth: true,
                    changeYear: true,
                    beforeShow: function () {
                        setTimeout(function () {
                            $('.ui-datepicker').css('z-index', 1050);
                        }, 0);
                    },
                    onClose: function (dateText, inst) {
                        // if (txtStateDate.val() != '') {
                        //     var testStartDate = txtStateDate.datetimepicker('getDate');
                        //     var testEndDate = txtEndDate.datetimepicker('getDate');
                        //     if (testStartDate > testEndDate)
                        //         txtStateDate.datetimepicker('setDate', testEndDate);
                        // }
                        // else {
                        //     txtStateDate.val(dateText);
                        // }
                    },
                    onSelect: function (selectedDateTime) {
                        txtStateDate.datetimepicker('option', 'maxDate', txtEndDate.datetimepicker('getDate'));
                        txtEndDate.datepicker("hide");
                    }
                });
                //});
            }
        };
    }

    function bzMedia(bzEvents) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                var player = iElement[0];
                registerEvents();

                scope.$on(bzEvents.media.PLAY, function () {
                    play();
                });

                scope.$on(bzEvents.media.PAUSE, function () {
                    pause();
                });

                scope.$on(bzEvents.media.STOP, function () {
                    stop();
                });

                scope.$on(bzEvents.media.SEEK, function (event, data) {
                    seek(data);
                });

                scope.$on(bzEvents.media.VOLUME, function (event, data) {
                    setVolume(data);
                });

                scope.$on(bzEvents.media.FULLSCREEN, function (event, data) {
                    console.log('request Fullscreen');
                    if (data) {
                        helperJs.enterFullScreen(player);
                    } else {
                        helperJs.exitFullScreen();
                    }
                });

                scope.$on(bzEvents.media.ENTER_FULLSCREEN, function (event) {
                    console.log('enter Fullscreen');
                });

                scope.$on(bzEvents.media.EXIT_FULLSCREEN, function (event) {
                    console.log('exit Fullscreen');
                });

                function registerEvents() {
                    document.addEventListener("fullscreenchange", onFullscreenChange, false);
                    document.addEventListener("webkitfullscreenchange", onFullscreenChange, false);
                    document.addEventListener("mozfullscreenchange", onFullscreenChange, false);
                    document.addEventListener("MSFullscreenChange", onFullscreenChange, false);
                    player.addEventListener('webkitendfullscreen', onFullscreenChange, false);
                    iElement.on('ended', function (event) {
                        onEnded();
                    });
                }

                function play() {
                    player.play();
                }

                function pause() {
                    player.pause();
                }

                function stop() {
                    player.pause();
                    player.currentTime = 0;
                }

                function seek(value) {
                    player.currentTime = value;
                }

                function setVolume(value) {
                    player.volume = value;
                }

                function onEnded() {
                    scope.$emit(bzEvents.media.ENDED);
                }

                function onFullscreenChange() {
                    var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
                    if (fullscreenElement) {
                        scope.$emit(bzEvents.media.ENTER_FULLSCREEN);
                    } else {
                        scope.$emit(bzEvents.media.EXIT_FULLSCREEN);
                    }
                }
            }
        };
    }

    function bzLoading() {
        var markup =
            '<div class="loading-mask">' +
            '<div id="bar-wave" class="bar-wave loading-style">' +
            '<div class="bar">' +
            '<div class="rect1"></div>' +
            '<div class="rect2"></div>' +
            '<div class="rect3"></div>' +
            '<div class="rect4"></div>' +
            '<div class="rect5"></div>' +
            '</div>' +
            '</div>' +
            '<div id="circle-spread" class="circle-spread loading-style">' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '</div>' +
            '<div id="circle-line-spread" class="circle-line-spread loading-style">' +
            '<div></div>' +
            '<div></div>' +
            '<div></div>' +
            '</div>' +
            '<div id="hoz-load-bar" class="hoz-load-bar loading-style">' +
            '<div class="bar1"></div>' +
            '<div class="bar2"></div>' +
            '<div class="bar3"></div>' +
            '<div class="bar4"></div>' +
            '<div class="bar5"></div>' +
            '<div class="bar6"></div>' +
            '<div class="bar7"></div>' +
            '<div class="bar8"></div>' +
            '</div>' +
            '</div>';
        return {
            restrict: 'E',
            templateUrl: markup,
            replace: true,
            link: function (scope, iElement, iAttrs) {
                iElement.find(iAttrs.loadingType).show();
            }
        };
    }

    function bzCustomScrollbar($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                var o = {
                    selector: iElement[0],
                    theme: iAttrs.scrollbarTheme || 'light',
                    scrollbarPosition: iAttrs.scrollbarPosition || 'inside',
                    mouseWheel: {
                        scrollAmount: 20
                    },
                    scrollButtons: {
                        enable: iAttrs.scrollbarArrow === 'true'
                    }
                };

                scope.$on('bz:CustomScrollbarRender', function () {
                    render();
                });

                $timeout(function () {
                    render();
                }, 500);

                function render() {
                    $(o.selector).mCustomScrollbar(o);
                }
            }
        };
    }

    function bzRepeatCompleted() {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                var arrEvents = iAttrs.bzRepeatCompleted.split(',');
                if (scope.$last) {
                    for (var i = 0; i < arrEvents.length; i++) {
                        scope.$emit(arrEvents[i]);
                    }
                }
            }
        };
    }

    function bzPager($state) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                pageParams: '=',
                pageState: '@'
            },
            template: '<div class="bz-pager">' +
            '<a class="prev" ng-if="pageParams.page > 1" ui-sref="{{pageState}}({page: pageParams.page - 1 < 1 ? 1 : pageParams.page - 1})"><i class="fa fa-chevron-left"></i></a>' +
            '<a class="first" ng-if="pageParams.page > 3" ui-sref="{{pageState}}({page: 1})">1</a>' +
            '<a class="dot" ng-if="pageParams.page > 3">...</a>' +
            '<a class="num" ng-class="{active: page === pageParams.page}" ng-href="{{toHref(page)}}" ng-repeat="page in pageVisible">{{page}}</a>' +
            '<a class="dot" ng-if="pageParams.page < pageParams.pageCount - 2">...</a>' +
            '<a class="last" ng-if="pageParams.page < pageParams.pageCount - 2" ui-sref="{{pageState}}({page: pageParams.pageCount})">{{pageParams.pageCount}}</a>' +
            '<a class="next" ng-if="pageParams.page < pageParams.pageCount" ui-sref="{{pageState}}({page: (pageParams.page > pageParams.pageCount) ? pageParams.pageCount : (pageParams.page + 1)})"><i class="fa fa-chevron-right"></i></a>' +
            '</div>',
            link: function (scope, iElement, iAttrs) {
                scope.pageParams.page = parseInt(scope.pageParams.page);
                scope.toHref = toHref;

                processPage();

                scope.$on('bz:pageRefresh', function (event, data) {
                    scope.pageParams.pageCount = data;
                    processPage();
                });

                function toHref(page) {
                    return $state.href(scope.pageState, { page: page });
                };

                function processPage() {
                    scope.pageVisible = [];
                    var pageMin = Math.ceil(Math.min(Math.max(1, scope.pageParams.page - (settingJs.pageVisibleCount / 2)), Math.max(1, scope.pageParams.pageCount - settingJs.pageVisibleCount + 1)));
                    var pageMax = Math.ceil(Math.min(scope.pageParams.pageCount, pageMin + settingJs.pageVisibleCount - 1));
                    for (var i = pageMin; i <= pageMax; i++) {
                        scope.pageVisible.push(i);
                    }
                }
            }
        };
    }

    function bzParallax($timeout) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                if (is.desktop()) {
                    scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                        $timeout(function () {
                            iElement.find(iAttrs.bzParallax).parallax();
                        }, 1000);
                    });

                    scope.$on('$destroy', function () {
                        iElement.find(iAttrs.bzParallax).parallax('disable');
                    });
                }
            }
        };
    }

    function bzFancybox($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                if (helperJs.isUndefinedNullEmpty(iAttrs.bzFancybox)) {
                    scope.$on('bz:fancyBox', function () {
                        fancyBox();
                    });
                } else if (iAttrs.bzFancybox === 'static') {
                    fancyBox();
                }

                function fancyBox() {
                    iElement.find('a.fancybox').fancybox({
                        beforeLoad: function () {
                            $rootScope.$broadcast('bz:allowInputControls', false);
                        },
                        beforeClose: function () {
                            $rootScope.$broadcast('bz:allowInputControls', true);
                        }
                    });
                }
            }
        }
    }

    function bzInfinityScroll() {
        return {
            restrict: 'A',
            scope: {
                bzInfinityScroll: '&',
                bzInfinityBottom: '@'
            },
            link: function (scope, iElement, iAttrs) {
                var win = $(window);
                scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                    if (fromState.name !== toState.name) {
                        win.off('scroll.infinity');
                    }
                });

                win.on('scroll.infinity', helperJs.debounce(function (event) {
                    var offset = isNaN(scope.bzInfinityBottom) ? $(scope.bzInfinityBottom).position().top : parseInt(scope.bzInfinityBottom);
                    if (win.scrollTop() + win.height() >= $(document).height() - offset) {
                        scope.bzInfinityScroll();
                    }
                }, 500));
            }
        };
    }

    function bzFullframe() {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                var jRes = jRespond([
                    { label: 'handheld', enter: 0, exit: 1023 },
                    { label: 'desktop', enter: 1024, exit: 10000 }
                ]);

                jRes.addFunc({
                    breakpoint: 'handheld',
                    enter: function () {
                        $('html').removeClass(iAttrs.bzFullframe);
                    }
                });

                jRes.addFunc({
                    breakpoint: 'desktop',
                    enter: function () {
                        $('html').addClass(iAttrs.bzFullframe);
                    }
                });
            }
        };
    }

    function bzTag() {
        return {
            require: '?ngModel',
            replace: true,
            template: '<div class="bz-tag form-control">' +
            '<ul>' +
            '<li ng-repeat="key in keys track by $index">{{key}}<i class="glyphicon glyphicon-remove" ng-click="remove($index)"></i></li>' +
            '</ul>' +
            '<input type="text" placeholder="Enter để thêm từ khoá" />' +
            '<div class="clearfix"></div>' +
            '</div>',
            link: function (scope, iElement, iAttrs, ngModel) {
                scope.keys = [];
                scope.remove = remove;

                iElement.find('input').on('keypress', function (event) {
                    if (event.keyCode === 13) {
                        var text = $.trim($(this).val());
                        if (scope.keys.indexOf(text) === -1 && text.length > 0) {
                            scope.keys.push(text);
                            console.log(scope.keys);

                            $(this).val('');
                            ngModel.$setViewValue(scope.keys);
                        }

                        scope.$apply();

                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    }
                });

                function remove(index) {
                    scope.keys.splice(index, 1);
                    ngModel.$setViewValue(scope.keys);
                }
            }
        };
    }
    function bzCheckDate() {
        return {
            require: "ngModel",
            link: function (scope, elem, attr, modelCtrl) {

                modelCtrl.$parsers.push(function (value) {
                    modelCtrl.$setValidity('isdate', moment(value, ["DD/MM/YYYY"], true).isValid() == true || value =='');
                    return value;
                });
            }
        }
    }
    function bzInputNumber() {
        return {
            restrict: 'A',
            link: function (scope, iElement, iAttrs) {
                iElement.on('keypress', function (event) {
                    // Start: Allow Dot
                    if (iAttrs.allowDot == '1') {
                        if (event.which != 8 && event.which != 0 && event.which != 46 && (event.which < 48 || event.which > 57)) {
                            return false;
                        }
                    }
                    // Start: Allow Dot
                    else {
                        if (event.which != 8 && event.which != 0 && (event.which < 48 || event.which > 57)) {
                            return false;
                        }
                    }
                });
            }
        };
    }

    function bzCropper($state, $timeout) {
        return {
            replace: true,
            templateUrl: '/assets/global/cropper/crop.html',
            link: function (scope, iElement, iAttrs) {
                var cropper = null,
                    flipCircle = 0,
                    fileInput = iElement.find('#cropper-input-file'),
                    imgCrop = iElement.find('#cropper-img');

                scope.showButtonCrop = false;
                scope.loading = false;

                scope.getImage = getImage;
                scope.setImage = setImage;
                scope.fileTrigger = fileTrigger;
                scope.zoom = zoom;
                scope.rotate = rotate;
                scope.scale = scale;

                scope.$on('$destroy', function () {
                    cropper.cropper('destroy');
                });

                if (iAttrs.cropImage) {
                    scope.loading = true;
                    imgCrop[0].crossOrigin = 'anonymous';
                    imgCrop[0].src = iAttrs.cropImage;

                    $timeout(function () {
                        scope.showButtonCrop = true;
                        initCropper();
                    }, 1000);

                } else {
                    initCropper();
                }

                function fileTrigger() {
                    console.log(123);
                    iElement.find('#cropper-input-file').click();
                }

                function zoom(val) {
                    cropper.cropper('zoom', val);
                }

                function rotate(val) {
                    if (val) {
                        cropper.cropper('rotate', val);
                    } else {
                        cropper.cropper('rotate', 90)
                    }
                }

                function scale(val) {
                    if (val) {
                        cropper.cropper('scale', val);
                    } else {
                        flipCircle++;
                        switch (flipCircle) {
                            case 1: cropper.cropper('scale', -1, 1); break;
                            case 2: cropper.cropper('scale', 1, -1); break;
                            case 3: cropper.cropper('scale', -1, -1); break;
                            case 4: cropper.cropper('scale', 1, 1); flipCircle = 0; break;
                        }
                    }
                }

                function initCropper() {
                    cropper = imgCrop.cropper({
                        aspectRatio: iAttrs.cropRatio,
                        guides: false
                    });
                    scope.loading = false;
                }

                function setImage(obj) {
                    var URL = window.URL || window.webkitURL,
                        blobURL;

                    if (URL) {
                        blobURL = URL.createObjectURL(obj.files[0]);
                        imgCrop.one('built.cropper', function () {
                            URL.revokeObjectURL(blobURL);
                        }).cropper('reset').cropper('replace', blobURL);

                        setTimeout(function () {
                            scope.$apply(function () {
                                scope.showButtonCrop = true;
                            });
                        })

                    }
                }

                function getImage() {
                    var canvasData = cropper.cropper('getCroppedCanvas', {
                        width: iAttrs.cropWidth,
                        height: iAttrs.cropHeight
                    });

                    var imgCropped = canvasData.toDataURL(iAttrs.cropMime);

                    scope.$root.$broadcast(iAttrs.cropEvent, { image: imgCropped });
                }
            }
        };
    }

    // bzRestrictInput by The Boss
    function bzInputOnlyDigits() {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                modelCtrl.$parsers.push(function (inputValue) {
                    if (inputValue == undefined) return '';
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        }
    }
})();


// function bzInputMatch() {
//     return {
//         restrict: 'A',
//         scope: true,
//         require: 'ngModel',
//         link: function (scope, elem, attrs, control) {
//             var checker = function () {

//                 //lấy giá trị 
//                 var e1 = scope.$eval(attrs.ngModel);

//                 //lấy giá trị của xác nhận
//                 var e2 = scope.$eval(attrs.bzInputMatch);
//                 return e1 == e2;
//             };
//             scope.$watch(checker, function (n) {


//                 control.$setValidity("unique", n);
//             });
//         }
//     };
// }