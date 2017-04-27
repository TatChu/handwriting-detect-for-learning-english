(function () {
    'use strict';

    angular
        .module('bzSearch')
        .service('searchSvc', searchSvc)
        .service('searchFac', searchFac);

    function searchFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function searchSvc($q, $window, bzResourceSvc, searchFac) {
        return {
            getAll: getAll,
            create: create,
            active: active,
            edit: edit,
            update: update,
            del: del
        };

        function getAll(data) {
            data.method = 'search';
            var getData = new searchFac();
            return getData.$get(data);
        }

        function create(data) {
            var createData = new searchFac(data);
            return createData.$save({ method: 'search' });
        }

        function edit(id) {
            var editData = new searchFac();
            return editData.$get({ method: 'search', id: id });
        }

        function update(data, id) {
            var updateData = new searchFac(data);
            return updateData.$save({ method: 'search', id: id });
        }

        function del(id) {
            var deleteData = new searchFac();
            return deleteData.$delete({ method: 'search', id: id });
        }

        function active(id) {
            var activeData = new searchFac();
            return activeData.$get({ method: 'search-active', id: id });
        }
    }
})();