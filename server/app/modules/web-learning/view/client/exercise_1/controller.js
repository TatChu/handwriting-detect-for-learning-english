var exercise_1_Ctrl = (function () {
    'use strict';

    angular
        .module('bsLearning')
        .controller('exercise_1_Ctrl', exercise_1_Ctrl);

    function exercise_1_Ctrl($scope, $window, bzResourceSvc) {
        var vmExercise_1 = this;

        // VARS
        var _video = null,
            patData = null;

        vmExercise_1.showDemos = false;
        vmExercise_1.edgeDetection = false;
        vmExercise_1.mono = false;
        vmExercise_1.invert = false;

        vmExercise_1.patOpts = { x: 0, y: 0, w: 25, h: 25 };

        // Setup a channel to receive a video property
        // with a reference to the video element
        // See the HTML binding in main.html
        vmExercise_1.channel = {};

        vmExercise_1.webcamError = false;
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

        vmExercise_1.onStream = function (stream) {
            // You could do something manually with the stream.
        };


        /**
         * Make a snapshot of the camera data and show it in another canvas.
         */
        vmExercise_1.makeSnapshot = function makeSnapshot() {
            if (_video) {
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas) return;

                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData(vmExercise_1.patOpts.x, vmExercise_1.patOpts.y, vmExercise_1.patOpts.w, vmExercise_1.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);

                sendSnapshotToServer(patCanvas.toDataURL());

                patData = idata;
            }
        };

        /**
         * Redirect the browser to the URL given.
         * Used to download the image by passing a dataURL string
         */
        vmExercise_1.downloadSnapshot = function downloadSnapshot(dataURL) {
            window.location.href = dataURL;
        };

        var getVideoData = function getVideoData(x, y, w, h) {
            var hiddenCanvas = document.createElement('canvas');
            hiddenCanvas.width = _video.width;
            hiddenCanvas.height = _video.height;
            var ctx = hiddenCanvas.getContext('2d');
            ctx.drawImage(_video, 0, 0, _video.width, _video.height);
            return ctx.getImageData(x, y, w, h);
        };

        var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
            vmExercise_1.snapshotData = imgBase64;
        };

    }
})();
