(function () {
    'use strict';

    angular
        .module('bzPromotion')
        .factory('promotionFac', promotionFac)
        .service('promotionSvc', promotionSvc);

    function promotionFac(bzResourceSvc) {
        return bzResourceSvc.api(settingJs.configs.adminUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function promotionSvc($q, promotionFac) {
        return {
            getAll: getAll,
            add: add,
            create: create,
            edit: edit,
            update: update,
            delete: del,
        };

        function getAll(query) {
            query.method = 'promotion';
            var data = new promotionFac()
            return data.$get(query);
        }

        function add(data) {
            var addData = new promotionFac(data);
            return addData.$get({ method: 'promotion-add' });
        }

        function create(data) {
            var createData = new promotionFac(data);
            return createData.$save({ method: 'promotion' });
        }

        function edit(id) {
            var editData = new promotionFac();
            return editData.$get({ method: 'promotion', id: id });
        }

        function update(data, id) {
            var updateData = new promotionFac(data);
            return updateData.$save({ method: 'promotion', id: id});
        }

        function del(id) {
            var deleteData = new promotionFac();
            return deleteData.$delete({ method: 'promotion', id: id });
        }
    }
})();