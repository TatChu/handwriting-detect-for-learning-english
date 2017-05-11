var vocabularyWebCtrl = (function () {
    'use strict';

    angular
        .module('bsLearning')
        .controller('vocabularyWebCtrl', vocabularyWebCtrl);

    function vocabularyWebCtrl($scope, $rootScope, $window, $uibModal, bzResourceSvc, listTypesWord) {
        var vmLearn = this;

        // VARS
        vmLearn.imgDir = settingJs.configs.uploadDirectory.vocabulary || '/files/images/vocabulary_image/';
        vmLearn.Domain = settingJs.configs.webUrl;

        vmLearn.listVocabulary = $window.vocabularys;

        vmLearn.index = -1;

        //Inits
        Init();

        // METHODS
        vmLearn.speak = speak;
        vmLearn.next = next;
        vmLearn.prev = prev;
        vmLearn.getClasses = getClasses;
        vmLearn.openExersice_1 = openExersice_1;

        // function
        function Init() {
            if (vmLearn.listVocabulary.length > 0) {
                vmLearn.index = 0;
                vmLearn.word = vmLearn.listVocabulary[vmLearn.index];
            }
        }

        function openExersice_1() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: settings.services.webUrl + '/modules/web-learning/view/client/popup/exercise_1/excercise_1.html',
                controller: 'exercise_1_Ctrl',
                controllerAs: 'vmExercise_1',
                size: 'lg',
                resolve: {
                    word: function () {
                        return angular.copy(vmLearn.word);
                    },
                    listVocabulary: function () {
                        return angular.copy(vmLearn.listVocabulary);
                    }
                }
            });

            modalInstance.result.then(function () {
                $rootScope.stream.getTracks()[0].stop();
            }, function () {
            });
        }

        function speak() {
            responsiveVoice.speak(vmLearn.word.word);
        }

        function next() {
            if (vmLearn.listVocabulary.length - 1 > vmLearn.index) {
                vmLearn.index++;;
                vmLearn.word = vmLearn.listVocabulary[vmLearn.index];
            }
        }

        function prev() {
            if (vmLearn.index > 1) {
                vmLearn.index--;;
                vmLearn.word = vmLearn.listVocabulary[vmLearn.index];
            }
        }

        function getClasses(classesEsnglish) {
            var classes = '';
            listTypesWord.forEach(function (item) {
                if (item.value == ('' + classesEsnglish))
                    classes = item.name;
            });
            return classes;
        }

    }
})();
