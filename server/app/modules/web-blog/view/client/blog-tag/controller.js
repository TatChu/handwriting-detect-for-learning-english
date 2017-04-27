var blogWebCtrl = (function () {
    'use strict';

    angular
        .module('bzWebBlog')
        .controller('blogWebCtrl', blogWebCtrl);

    function blogWebCtrl($scope, $window, blogWebSvc, bzResourceSvc) {
        var vmBlogWeb = this;

        // VARS
        vmBlogWeb.imgDir = settingJs.configs.uploadDirectory.blog || '/files/images/blog_image/';
        vmBlogWeb.tags = [];

        vmBlogWeb.Domain = settingJs.configs.webUrl;
    }
})();
