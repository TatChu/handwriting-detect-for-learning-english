(function() {
    'use strict';

    angular
        .module('bzUnit')
        .service('unitSvc', unitSvc)
        .factory('unitFac', unitFac);

    function unitFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function unitSvc($q, $window, bzResourceSvc, unitFac) {
        return {
            create: create,
            update: update,
            getAll: getAll,
            get: get
        };

        function create(data, id) {
            var createData = new unitFac(data);

            return createData.$save({ method: 'unit' });
        }

        function update(data, id) {
            var unitFactory = new unitFac(data);
            return unitFactory.$update({ method: 'unit', id: id });
        }

        function getAll(data){
            var unitFactory = new unitFac(data);
            return unitFactory.$get({method: 'unit'});
        }
        function get (id){
             var unitFactory = new unitFac();
            return unitFactory.$get({method: 'unit', id: id});
        }
    }
})();