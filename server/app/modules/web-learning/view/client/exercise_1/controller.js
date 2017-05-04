var exercise_1_Ctrl = (function () {
    'use strict';

    angular
        .module('bsLearning')
        .controller('exercise_1_Ctrl', exercise_1_Ctrl);

    function exercise_1_Ctrl($scope, $window, bzResourceSvc) {
        var vmExercise_1 = this;

        // VARS
        vmExercise_1.imgDir = settingJs.configs.uploadDirectory.vocabulary || '/files/images/vocabulary_image/';
        vmExercise_1.Domain = settingJs.configs.webUrl;


        //Inits

        // METHODS

        vmExercise_1.onError = function (err) {

        };
        vmExercise_1.onStream = function (stream) {

        };
        
        vmExercise_1.onSuccess = function () { 

        };

    }
})();
