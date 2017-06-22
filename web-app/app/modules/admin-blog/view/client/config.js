;
(function () {
    'use strict';

    Application.registerModule('bzBlog');

    angular
        .module('bzBlog', [])
        .constant('CKEditorOptBlog', {
            imageUploadUrl: settings.services.uploadApi + '/upload/for-ckeditor/image-upload?type=blog_image&prefix=blog_image',
            filebrowserUploadUrl: settings.services.uploadApi + '/upload/for-ckeditor/file-browser-upload?type=blog_image&prefix=blog_image',
            removePlugins: 'about,bidi,flash,horizontalrule,language,save,specialchar'
            // filebrowserBrowseUrl : settings.services.uploadApi + '/list/img-content-product',
            // filebrowserWindowWidth : '1000',
            // filebrowserWindowHeight : '700' cke_button__save
        })
        .run(run);

    function run() {
    }
})();