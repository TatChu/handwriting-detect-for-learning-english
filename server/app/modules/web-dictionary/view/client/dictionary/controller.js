var dictionaryWebCtrl = (function () {
    'use strict';

    angular
        .module('bsDictionary')
        .controller('dictionaryWebCtrl', dictionaryWebCtrl);

    function dictionaryWebCtrl($scope, $window, bzResourceSvc) {
        var vmDictionary = this;
        // VARS
        vmDictionary.wordSelected = null;
        vmDictionary.Domain = settingJs.configs.webUrl;
        vmDictionary.lang = 'en';
        //Inits

        // METHODS

        vmDictionary.remoteUrlRequestFn = function (keyword) {
            return { word: keyword };
        };

        vmDictionary.onSelected = function (selected) {
            if (selected) {
                vmDictionary.wordSelected = selected.originalObject;
            } else {
                vmDictionary.wordSelected = null;
            }
        }

        vmDictionary.changeLanguage = function (lang) {
            vmDictionary.lang = lang;
        }

        vmDictionary.speak = function () {
            responsiveVoice.speak(vmDictionary.wordSelected.word);
        }
    }
})();
