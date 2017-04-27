;
(function () {
    'use strict';

    Application.registerModule('bzProduct');

    angular
        .module('bzProduct', [])
        .constant('CKEditorOptPro', {
            imageUploadUrl: settings.services.uploadApi + '/upload/for-ckeditor/image-upload?type=product_image&prefix=product_image',
            filebrowserUploadUrl: settings.services.uploadApi + '/upload/for-ckeditor/file-browser-upload?type=product_image&prefix=product_image',
            removePlugins: 'about,bidi,blockquote,div,flash,horizontalrule,language,pagebreak,save,smiley,sourcearea,specialchar'
            // filebrowserBrowseUrl : settings.services.uploadApi + '/list/img-content-product',
            // filebrowserWindowWidth : '1000',
            // filebrowserWindowHeight : '700' cke_button__save
        })
        .constant('statusProduct', [
            {
                value: 'HH',
                name: 'Hết hàng'
            },
            {
                value: 'HSV',
                name: 'Hàng sắp về'
            },
            {
                value: 'CH',
                name: 'Còn hàng'
            },
        ]);
})();