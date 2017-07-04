var exercise_2_Ctrl = (function () {
    'use strict';

    angular
        .module('bsLearning')
        .controller('exercise_2_Ctrl', exercise_2_Ctrl);

    function exercise_2_Ctrl($scope, $filter, $rootScope, $window, bzUpload, customResourceSrv, LearnSvc, $uibModal, $bzPopup) {
        var vmExercise_2 = this;

        // VARS
        vmExercise_2.imgUploadLink = settingJs.configs.uploadDirectory.tmp || '/files/images/tmp/';
        vmExercise_2.imgVocabularyLink = settingJs.configs.uploadDirectory.vocabulary || '/files/images/vocabulary_image/';
        vmExercise_2.configs = {
            analysisImage: true, // tự động crop ảnh
            delayTime: true, // chụp ảnh sau 3 giây từ khi bấm nút chụp ảnh
            timeDelay: 3
        }


        var _video = null,
            patData = null
        $rootScope.stream = null;

        vmExercise_2.showDemos = false;
        vmExercise_2.edgeDetection = false;
        vmExercise_2.mono = false;
        vmExercise_2.invert = false;
        vmExercise_2.patOpts = { x: 0, y: 0, w: 260, h: 180 };
        vmExercise_2.channel = {};
        vmExercise_2.webcamError = false;

        vmExercise_2.listVocabulary = window.vocabularys;
        vmExercise_2.indexWord = 0;

        vmExercise_2.hasImage = false;

        // Chứa thông tin ảnh xử lý
        vmExercise_2.imgProcessed = {
            isProcessed: false,
            data: null
        }
        // Chứa dữ liệu đã nhận dạng
        vmExercise_2.textRecognition = {
            identified: false,
            chars: [],
            data: [],
            resultExactly: false
        }

        // INIT
        init();

        // METHOD
        vmExercise_2.resetImage = resetImage;
        vmExercise_2.checkResult = checkResult;
        vmExercise_2.makeSnapshot = makeSnapshot;
        vmExercise_2.uploadImage = uploadImage;
        vmExercise_2.exit = exit;

        vmExercise_2.init = init;
        vmExercise_2.processImg = processImg;
        vmExercise_2.delImageRecog = delImageRecog;
        vmExercise_2.nextWord = nextWord;
        vmExercise_2.onChangeTimeDelay = onChangeTimeDelay;

        // FUNCTION

        function onChangeTimeDelay() {
            vmExercise_2.configs.timeDelay = vmExercise_2.configs.delayTime ? 3 : 0;
        }

        function resetImage() {
            vmExercise_2.hasImage = false;
            vmExercise_2.imgProcessed.isProcessed = false;
        }

        function processImg() {
            LearnSvc.processImage({
                directory: settingJs.configs.uploadDirectory.tmp,
                name: vmExercise_2.image.name
            }).then(function (resp) {
                console.log('processImg', resp)
                vmExercise_2.imgProcessed.isProcessed = true;
                vmExercise_2.imgProcessed.image = resp.resp;
            }).catch(function (err) {
                console.log('err processImg', err)
            })
        }

        function analysisImage() {
            LearnSvc.analysisImage({
                name: vmExercise_2.image.name
            }).then(function (resp) {
                vmExercise_2.imgProcessed.data = resp.listImage;
                vmExercise_2.imgProcessed.data = $filter('orderBy')(vmExercise_2.imgProcessed.data, 'detail.x', false)
                vmExercise_2.imgProcessed.isProcessed = true;
                vmExercise_2.image.name = resp.imageDetect;
                checkResult();
            }).catch(function (err) {
                console.log('err processImg', err)
            })
        }

        function checkResult() {
            vmExercise_2.textRecognition.chars = [];
            // Dệ quy check các kết quả
            function checkItem(index) {
                if (index == vmExercise_2.imgProcessed.data.length) {
                    // Custom result recoginiton
                    vmExercise_2.textRecognition.data.forEach(function (item, i) {
                        console.log(1111, i, item)
                        if (vmExercise_2.textRecognition.chars[i] != vmExercise_2.word.word[i]) {
                            if (item.secondDetect == vmExercise_2.word.word[i]) {
                                vmExercise_2.textRecognition.chars[i] = item.secondDetect;
                            }
                        }
                    });

                    // Kiểm tra tỷ lệ nhận dạng
                    var pass = 0, faild = 0, allowFaild = 30, total = vmExercise_2.textRecognition.chars.length;
                    vmExercise_2.textRecognition.chars.forEach(function (item, i) {
                        if (item == vmExercise_2.word.word[i]) {
                            pass++;
                        }
                        else {
                            faild++;
                        }
                    });
                    // Nếu tỷ lệ nhận dạng sai dưới 30% thì cho phép đúng
                    if (((faild / total) * 100) <= 30) {
                        vmExercise_2.textRecognition.chars = vmExercise_2.word.word;
                    }
                    if (typeof vmExercise_2.textRecognition.chars == 'array' || typeof vmExercise_2.textRecognition.chars == 'object') {
                        vmExercise_2.textRecognition.chars = vmExercise_2.textRecognition.chars.join('');
                    }
                    if (vmExercise_2.textRecognition.chars.toUpperCase() == vmExercise_2.word.word.toUpperCase()) {
                        vmExercise_2.textRecognition.resultExactly = true;
                    }
                    else {
                        vmExercise_2.textRecognition.resultExactly = false;
                    }
                    vmExercise_2.textRecognition.identified = true;
                    console.log('Result check: ', vmExercise_2.textRecognition)
                }
                else {
                    recognition(vmExercise_2.imgProcessed.data[index], function (resp) {
                        vmExercise_2.textRecognition.data.push(resp);
                        vmExercise_2.textRecognition.chars.push(resp.charPredict);
                        ++index;
                        checkItem(index);
                    });
                }
            }
            if (vmExercise_2.imgProcessed.data.length == vmExercise_2.word.word.length) {
                checkItem(0);
            }
            if (vmExercise_2.imgProcessed.data.length > vmExercise_2.word.word.length) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Số lượng ký tự chưa đúng',
                        message: 'Hãy bỏ các ký tự dư trên ảnh của bạn'
                    }
                });
                return;
            }
            if (vmExercise_2.imgProcessed.data.length < vmExercise_2.word.word.length) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Số lượng ký tự chưa đúng',
                        message: 'Hãy thử lại với ảnh khác'
                    }
                });
                return;
            }
        }
        function recognition(data, callback) {
            LearnSvc.recognition({
                directory: settingJs.configs.uploadDirectory.tmp,
                name: data.image
            }).then(function (resp) {
                callback(resp);
            }).catch(function (err) {
            })
        }
        function init() {
            vmExercise_2.textRecognition.resultExactly = false;
            if (vmExercise_2.indexWord < vmExercise_2.listVocabulary.length) {
                vmExercise_2.word = vmExercise_2.listVocabulary[vmExercise_2.indexWord];
                // reset kêt quả trước nếu có
                resetImage();
                vmExercise_2.textRecognition.identified = false;
                var sentenseSplit = vmExercise_2.word.sentense_pattern.sentense.split(vmExercise_2.word.word);
                vmExercise_2.missingWord = vmExercise_2.word.word;

                var _replace = new Array(vmExercise_2.missingWord.length).fill('_').join(' ');

                vmExercise_2.textMissing = sentenseSplit.join(_replace);
            }
            else {
                return;
            }
        }

        function nextWord() {
            if (vmExercise_2.indexWord + 1 < vmExercise_2.listVocabulary.length) {
                vmExercise_2.indexWord++;
                vmExercise_2.word = vmExercise_2.listVocabulary[vmExercise_2.indexWord];
                init();
            }
        }

        function delImageRecog(index) {
            if (vmExercise_2.imgProcessed.data.length > vmExercise_2.word.word.length) {
                vmExercise_2.imgProcessed.data.splice(index, 1);
                if (vmExercise_2.imgProcessed.data.length == vmExercise_2.word.word.length) {
                    checkResult();
                }
            }
        }


        // WEBCAME PROCESS
        vmExercise_2.onError = function (err) {
            $scope.$apply(
                function () {
                    $scope.webcamError = err;
                }
            );
        };

        vmExercise_2.onSuccess = function () {
            // The video element contains the captured camera data
            _video = vmExercise_2.channel.video;
            $scope.$apply(function () {
                vmExercise_2.patOpts.w = _video.width;
                vmExercise_2.patOpts.h = _video.height;
                vmExercise_2.showDemos = true;
            });
        };

        vmExercise_2.onStream = function (videoStream) {
            $rootScope.stream = videoStream;
        };



        /**
         * Redirect the browser to the URL given.
         * Used to download the image by passing a dataURL string
         */
        vmExercise_2.downloadSnapshot = function downloadSnapshot(dataURL) {
            console.log(111, dataURL);
        };

        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };

        var processImageSnaphost = function processImageSnaphost(imgBase64) {
            vmExercise_2.snapshotData = imgBase64;
        };

        function exit() {
            $uibModalInstance.close();
            $rootScope.stream.getTracks()[0].stop();
        }

        function uploadImage() {
            var cropModal = $uibModal.open({
                animation: true,
                templateUrl: '/assets/global/cropper/view.html',
                controller: function ($scope, $uibModalInstance) {
                    var popupScope = this;
                    $scope.popupScope = {
                        // image: vmExercise_2.imgDir + vmExercise_2.image.name,
                        event: 'crop:image',
                        ratio: 1,
                        width: 300,
                        height: 300,
                        // mimeType : 'image/jpeg'
                    };
                    $scope.$on('crop:image', function (event, res) {
                        bzUpload.uploadBase64({ directory: 'tmp', image: res.image }).then(function (resp) {
                            vmExercise_2.image = resp;
                            cropModal.close();
                            vmExercise_2.hasImage = true;
                            analysisImage();
                        }).catch(function (err) {
                            $bzPopup.toastr({
                                type: 'error',
                                data: {
                                    title: 'Lỗi',
                                    message: err.message
                                }
                            });
                        })
                    });
                }
            });
        }

        function makeSnapshot() {
            setTimeout(function () {
                if (_video) {
                    var patCanvas = document.querySelector('#snapshot');
                    if (!patCanvas) return;

                    patCanvas.width = _video.width;
                    patCanvas.height = _video.height;
                    var ctxPat = patCanvas.getContext('2d');

                    var idata = getVideoData(vmExercise_2.patOpts.x, vmExercise_2.patOpts.y, _video.width, _video.height);
                    ctxPat.putImageData(idata, 0, 0);
                    processImageSnaphost(patCanvas.toDataURL());

                    bzUpload.uploadBase64({ directory: 'tmp', image: patCanvas.toDataURL() }).then(function (resp) {
                        vmExercise_2.image = resp;
                        analysisImage();
                    }).catch(function (err) {
                        $bzPopup.toastr({
                            type: 'error',
                            data: {
                                title: 'Lỗi',
                                message: err.message
                            }
                        });
                    })

                    patData = idata;
                    vmExercise_2.hasImage = true;
                }
                else {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Lỗi',
                            message: 'Không thể truy cập camera'
                        }
                    });
                }
            })

        };

    }
})();
