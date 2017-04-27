(function () {
    'use strict';

    angular
        .module('bzTag')
        .factory('tagFac', tagFac)
        .service('tagSvc', tagSvc);

    function tagFac(bzResourceSvc) {
        return bzResourceSvc.api(settingJs.configs.adminUrl + '/:method/:id/:type', { method: '@method', id: '@id', type: '@type'  });
    }

    function tagSvc($q, tagFac) {
        return {
            getAll: getAll,
            get: get,
            create: create,
            update: update,
            getProductById : getProductById,
            getListProduct : getListProduct,
            getProductByTag: getProductByTag,
            
        };

        function getAll() {
            var list = new tagFac();
            // console.log(createData);

            return list.$get({ method: 'tag'});
        }

        function get(id) {
            var getByID = new tagFac();
            return getByID.$get({ method: 'tag', id: id, type: "" });
        }

        function create(data) {
            var createData = new tagFac(data);
            console.log("gnsdkn sdnsd g");
            return createData.$save({ method: 'tag', type: "" });
        }

        function update(data, id) {
            var updateData = new tagFac(data);

            return updateData.$update({ method: 'tag', id: id, type: "" });
        }
        function getProductById(id) {
            var getProductById = new tagFac();
            return getProductById.$get({ method: 'product', id: id });
        }

        function getListProduct(id,type) {
            var getListProduct = new tagFac();
            return getListProduct.$get({ method: 'listProduct', id: id, type: type });
        }

        function getProductByTag(id,type) {
            var getProductByTag = new tagFac();
            return getProductByTag.$get({ method: 'tagProduct', id: id, type: type });
        }

        

        
    }
})();