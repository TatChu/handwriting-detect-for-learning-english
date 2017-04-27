(function() {
    'use strict';

    angular
        .module('bzSupplier')
        .service('supplierSvc', supplierSvc)
        .factory('supplierFac', supplierFac);

    function supplierFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function supplierSvc($q, $window, bzResourceSvc, supplierFac) {
        return {
            create: create,
            update: update,
            getAll: getAll,
            get: get
        };

        function create(data, id) {
            var createData = new supplierFac(data);
            return createData.$save({ method: 'supplier' });
        }

        function update(data, id) {
            var supplierFactory = new supplierFac(data);
            return supplierFactory.$update({ method: 'supplier', id: id });
        }

        function getAll(data){
            var supplierFactory = new supplierFac(data);
            return supplierFactory.$get({method: 'supplier'});
        }
        function get (id){
             var supplierFactory = new supplierFac();
            return supplierFactory.$get({method: 'supplier', id: id});
        }
    }
})();