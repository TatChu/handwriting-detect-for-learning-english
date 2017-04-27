(function () {
    'use strict';

    angular
        .module('bzBlog')
        .service('blogSvc', blogSvc)
        .factory('blogFac', blogFac);

    function blogFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function blogSvc($q, $window, bzResourceSvc, blogFac) {
        return {
            create: create,
            update: update,
            getAll: getAll,
            get: get,
            getTagsBlog: getTagsBlog
        };

        function create(data) {
            var createData = new blogFac(data);
            return createData.$save({ method: 'blog' });
        }

        function update(data, slug) {
            var blogFactory = new blogFac(data);
            return blogFactory.$update({ method: 'blog', id: slug });
        }

        function getAll(data) {
            var blogFactory = new blogFac(data);
            return blogFactory.$get({ method: 'blog' });
        }

        function get(slug) {
            var blogFactory = new blogFac();
            return blogFactory.$get({ method: 'blog', id: slug });
        }

        function getTagsBlog() {
            var getData = new blogFac();
            return getData.$get({ method: 'blog-tag' });
        }
    }
})();