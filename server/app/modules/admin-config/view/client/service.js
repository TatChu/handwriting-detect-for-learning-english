(function() {
    'use strict';

    angular
        .module('bzSupplier')
        .service('configSvc', configSvc)
        .factory('configFac', configFac);

    function configFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function configSvc($q, $window, bzResourceSvc, configFac) {
        return {
            create: create,
            update: update,
            getAll: getAll,
            get: get
        };

        function create(data, id) {
            var createData = new configFac(data);
            return createData.$save({ method: 'config' });
        }

        function update(data, id) {
            var configFactory = new configFac(data);
            return configFactory.$update({ method: 'config', id: id });
        }

        function getAll(data){
            var configFactory = new configFac(data);
            return configFactory.$get({method: 'config'});
        }
        function get (id){
             var configFactory = new configFac();
            return configFactory.$get({method: 'config', id: id});
        }
    }
})();