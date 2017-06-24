var exercise_1_Ctrl = (function () {
    'use strict';

    angular
        .module('bsLearning')
        .controller('exercise_1_Ctrl', exercise_1_Ctrl);

    function exercise_1_Ctrl($scope, $rootScope, $window, $uibModalInstance, $uibModal, bzUpload, customResourceSrv, LearnSvc, word, listVocabulary, $bzPopup) {
        var vmExercise_1 = this;

        // VARS
        vmExercise_1.imgDir = settingJs.configs.uploadDirectory.tmp || '/files/images/tmp/';
        vmExercise_1.configs = {
            autoCropImage: true, // tự động crop ảnh
            delayTime: true, // chụp ảnh sau 3 giây từ khi bấm nút chụp ảnh
            timeDelay: 3
        }

        vmExercise_1.onChangeTimeDelay = onChangeTimeDelay;

        var _video = null,
            patData = null
        $rootScope.stream = null;

        vmExercise_1.showDemos = false;
        vmExercise_1.edgeDetection = false;
        vmExercise_1.mono = false;
        vmExercise_1.invert = false;
        vmExercise_1.patOpts = { x: 0, y: 0, w: 260, h: 180 };
        vmExercise_1.channel = {};
        vmExercise_1.webcamError = false;

        vmExercise_1.word = word;
        vmExercise_1.listVocabulary = listVocabulary;
        vmExercise_1.indexWord = -1;
        vmExercise_1.hasImage = false;

        vmExercise_1.imgProcessed = {
            isProcessed: false,
            iamge: null
        }

        vmExercise_1.textRecognition = {
            identified: false,
            char: '',
            data: null
        }

        // INIT
        randomCharecter();

        // METHOD
        vmExercise_1.resetImage = resetImage;
        vmExercise_1.checkResult = checkResult;
        vmExercise_1.makeSnapshot = makeSnapshot;
        vmExercise_1.cropImage = cropImage;
        vmExercise_1.exit = exit;

        vmExercise_1.randomCharecter = randomCharecter;
        vmExercise_1.processImg = processImg;

        vmExercise_1.nextWord = nextWord;

        // FUNCTION

        function onChangeTimeDelay() {
            vmExercise_1.configs.timeDelay = vmExercise_1.configs.delayTime ? 3 : 0;
        }

        function resetImage() {
            vmExercise_1.hasImage = false;
            vmExercise_1.imgProcessed.isProcessed = false;
        }

        function processImg() {
            LearnSvc.processImage({
                directory: settingJs.configs.uploadDirectory.tmp,
                name: vmExercise_1.image.name
            }).then(function (resp) {
                console.log('processImg', resp)
                vmExercise_1.imgProcessed.isProcessed = true;
                vmExercise_1.imgProcessed.image = resp.resp;
            }).catch(function (err) {
                console.log('err processImg', err)
            })
        }

        function autoCropImage() {
            LearnSvc.autoCropImage({
                name: vmExercise_1.image.name
            }).then(function (resp) {
                vmExercise_1.imgProcessed.isProcessed = true;
                vmExercise_1.imgProcessed.image = resp;
                vmExercise_1.image.name = resp.newImage;
                checkResult();
            }).catch(function (err) {
                console.log('err processImg', err)
            })
        }

        function checkResult() {
            LearnSvc.recognition({
                directory: settingJs.configs.uploadDirectory.tmp,
                name: vmExercise_1.imgProcessed.image.name
            }).then(function (resp) {
                vmExercise_1.textRecognition.identified = true;
                vmExercise_1.textRecognition.char = resp.charPredict;
                vmExercise_1.textRecognition.data = resp;

                console.log('checkResult', resp)
            }).catch(function (err) {
                console.log('err checkResult', err)
            })
        }

        function randomCharecter() {
            // reset kêt quả trước nếu có
            resetImage();
            vmExercise_1.textRecognition.identified = false;

            var arr_charecter = vmExercise_1.word.word.split('');
            vmExercise_1.missingCharecter = arr_charecter[Math.round(Math.random() * (arr_charecter.length - 1))];
            var indexMissingCharecter = arr_charecter.indexOf(vmExercise_1.missingCharecter);
            arr_charecter[indexMissingCharecter] = '_';
            vmExercise_1.textMissing = arr_charecter.join('');

            vmExercise_1.listVocabulary.forEach(function (item, index) {
                if (item.word == vmExercise_1.word.word) {
                    vmExercise_1.indexWord = index;
                }
            });
        }

        function nextWord() {
            if (vmExercise_1.indexWord + 1 < vmExercise_1.listVocabulary.length) {
                vmExercise_1.indexWord++;
                vmExercise_1.word = vmExercise_1.listVocabulary[vmExercise_1.indexWord];
                randomCharecter();
            }
        }


        vmExercise_1.onError = function (err) {
            $scope.$apply(
                function () {
                    $scope.webcamError = err;
                }
            );
        };

        vmExercise_1.onSuccess = function () {
            // The video element contains the captured camera data
            _video = vmExercise_1.channel.video;
            $scope.$apply(function () {
                vmExercise_1.patOpts.w = _video.width;
                vmExercise_1.patOpts.h = _video.height;
                vmExercise_1.showDemos = true;
            });
        };

        vmExercise_1.onStream = function (videoStream) {
            $rootScope.stream = videoStream;
        };



        /**
         * Redirect the browser to the URL given.
         * Used to download the image by passing a dataURL string
         */
        vmExercise_1.downloadSnapshot = function downloadSnapshot(dataURL) {
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
            vmExercise_1.snapshotData = imgBase64;
        };

        function exit() {
            $uibModalInstance.close();
            $rootScope.stream.getTracks()[0].stop();
        }

        function cropImage() {
            var cropModal = $uibModal.open({
                animation: true,
                templateUrl: '/assets/global/cropper/view.html',
                controller: function ($scope, $uibModalInstance) {
                    var popupScope = this;
                    $scope.popupScope = {
                        image: vmExercise_1.imgDir + vmExercise_1.image.name,
                        event: 'crop:image',
                        ratio: 1,
                        width: 300,
                        height: 300,
                        // mimeType : 'image/jpeg'
                    };
                    $scope.$on('crop:image', function (event, res) {
                        bzUpload.uploadBase64({ directory: 'tmp', image: res.image }).then(function (resp) {
                            vmExercise_1.image = resp;
                            cropModal.close();
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

                    var idata = getVideoData(vmExercise_1.patOpts.x, vmExercise_1.patOpts.y, _video.width, _video.height);
                    ctxPat.putImageData(idata, 0, 0);
                    processImageSnaphost(patCanvas.toDataURL());

                    bzUpload.uploadBase64({ directory: 'tmp', image: patCanvas.toDataURL() }).then(function (resp) {
                        vmExercise_1.image = resp;

                        if (vmExercise_1.configs.autoCropImage) {
                            autoCropImage();
                        }
                        else {
                            cropImage();
                        }
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

                    vmExercise_1.hasImage = true;

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
