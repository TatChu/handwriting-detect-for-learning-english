(function () {
    'use strict';

    angular
        .module('bzImportProduct')
        .service('importProductSvc', importProductSvc)
        .service('importProductFac', importProductFac);

    function importProductFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function importProductSvc($q, $window, bzResourceSvc, importProductFac) {
        return {
            getAll: getAll,
            getDataImport: getDataImport,
            importProduct: importProduct,
            edit: edit,
            update: update,
            del: del
        };

        function getAll(query) {
            query.method = 'import-product';
            var getDataImport = new importProductFac(query);
            return getDataImport.$get(query);
        }

        function getDataImport() {
            var getDataImport = new importProductFac();
            return getDataImport.$get({ method: 'import-product-add' });
        }

        function importProduct(data) {
            var importProduct = new importProductFac(data);
            return importProduct.$save({ method: 'import-product' });
        }
        function edit(id) {
            var editImportProduct = new importProductFac();
            return editImportProduct.$get({ method: 'import-product', id: id });
        }

        function update(data, id) {
            var editImportProduct = new importProductFac(data);
            return editImportProduct.$save({ method: 'import-product', id: id });
        }

        function del(id) {
            var deleteImportProduct = new importProductFac();
            return deleteImportProduct.$delete({ method: 'import-product', id: id });
        }
    }
})();