(function() {
    'use strict';

    angular
        .module('bzCategory')
        .service('categorySvc', categorySvc)
        .factory('categoryFac', categoryFac);

    function categoryFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function categorySvc($q, $window, bzResourceSvc, categoryFac) {
        return {
            create: create,
            update: update,
            getAll: getAll,
            get: get,
            getChild: getChild,
            getById: getById
        };

        function create(data, id) {
            var createData = new categoryFac(data);
            return createData.$save({ method: 'category' });
        }

        function update(data, slug) {
            var categoryFactory = new categoryFac(data);
            return categoryFactory.$update({ method: 'category', id: slug });
        }

        function getAll(data){
            var categoryFactory = new categoryFac(data);
            return categoryFactory.$get({method: 'category'});
        }

        function get (slug){
             var categoryFactory = new categoryFac();
            return categoryFactory.$get({method: 'category', id: slug});
        }

        function getById (id){
             var categoryFactory = new categoryFac();
            return categoryFactory.$get({method: 'category_id', id: id});
        }

        function getChild (data, id){
             var categoryFactory = new categoryFac(data);
            return categoryFactory.$get({method: 'category_child', id: id});
        }
    }
})();