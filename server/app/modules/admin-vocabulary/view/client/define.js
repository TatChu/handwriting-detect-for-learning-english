;
(function () {
    'use strict';

    Application.registerModule('bzVocabulary');

    angular
        .module('bzVocabulary', [])
        .constant('listTypesWord', [
            { name: "Danh từ", value: "noun" },
            { name: "Đông từ", value: "verb" },
            { name: "Tính từ", value: "adjective" },
            { name: "Trạng tư", value: "adverb" },
            { name: "Đại từ nhân xưng", value: "pronoun" },
            { name: "Từ kết hợp", value: "conjunction" },
            { name: "Từ cảm thán", value: "determiner" },
            { name: "Từ cảm thán", value: "exclamation" },
        ])
        .constant('CKEditorOptVoca', {
            imageUploadUrl: settings.services.uploadApi + '/upload/for-ckeditor/image-upload?type=vocabulary_image&prefix=vocabulary_image',
            filebrowserUploadUrl: settings.services.uploadApi + '/upload/for-ckeditor/file-browser-upload?type=vocabulary_image&prefix=vocabulary_image',
            removePlugins: 'about,bidi,flash,horizontalrule,language,save,specialchar'
            // filebrowserBrowseUrl : settings.services.uploadApi + '/list/img-content-product',
            // filebrowserWindowWidth : '1000',
            // filebrowserWindowHeight : '700' cke_button__save
        });
})();