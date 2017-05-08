var exercise_1_Ctrl = (function () {
    'use strict';

    angular
        .module('bsLearning')
        .controller('exercise_1_Ctrl', exercise_1_Ctrl);

    function exercise_1_Ctrl($scope, $window, bzResourceSvc) {
        var vmExercise_1 = this;

        // VARS
        vmExercise_1.video = null;
        vmExercise_1.imgDir = settingJs.configs.uploadDirectory.vocabulary || '/files/images/vocabulary_image/';
        vmExercise_1.Domain = settingJs.configs.webUrl;
        vmExercise_1.channel = {
            videoHeight: 800,
            videoWidth: 600,
            video: null // Will reference the video element on success
        }

        //Inits

        // METHODS

        vmExercise_1.onError = function (err) {
            console.log(err);
        };
        vmExercise_1.onStream = function (stream) {
            console.log(stream);

        };

        vmExercise_1.onSuccess = function () {
            vmExercise_1._video = vmExercise_1.channel.video;
            vmExercise_1.patOpts = {
                w: vmExercise_1._video.width,
                h: vmExercise_1._video.height
            }
            vmExercise_1.showDemos = true;
        };


        /**
     * Make a snapshot of the camera data and show it in another canvas.
     */
        vmExercise_1.makeSnapshot = function makeSnapshot() {
            if (vmExercise_1._video) {
                var patCanvas = document.querySelector('#snapshot');
                if (!patCanvas) return;

                patCanvas.width = _video.width;
                patCanvas.height = _video.height;
                var ctxPat = patCanvas.getContext('2d');

                var idata = getVideoData(vmExercise_1.patOpts.x, vmExercise_1.patOpts.y, vmExercise_1.patOpts.w, vmExercise_1.patOpts.h);
                ctxPat.putImageData(idata, 0, 0);

                console.log(patCanvas);
                // sendSnapshotToServer(patCanvas.toDataURL());

                patData = idata;
            }
        };

    }
})();
