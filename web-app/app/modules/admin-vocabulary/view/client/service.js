(function () {
    'use strict';

    angular
        .module('bzVocabulary')
        .service('vocabularySvc', vocabularySvc)
        .factory('vocabularyFac', vocabularyFac);

    function vocabularyFac($window, customResourceSrv) {
        return customResourceSrv.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function vocabularySvc($q, $window, customResourceSrv, vocabularyFac) {
        return {
            create: create,
            update: update,
            getAll: getAll,
            get: get,

            getUnits: getUnits
        };

        function create(data, id) {
            var createData = new vocabularyFac(data);

            return createData.$save({ method: 'vocabulary' });
        }

        function update(data, id) {
            var vocabularyFactory = new vocabularyFac(data);
            return vocabularyFactory.$update({ method: 'vocabulary', id: id });
        }

        function getAll(data) {
            var vocabularyFactory = new vocabularyFac(data);
            return vocabularyFactory.$get({ method: 'vocabulary' });
        }
        function get(id) {
            var vocabularyFactory = new vocabularyFac();
            return vocabularyFactory.$get({ method: 'vocabulary', id: id });
        }

        function getUnits(classes) {
            var vocabularyFactory = new vocabularyFac();
            return vocabularyFactory.$get({ method: 'unit-by-class', id: classes });
        }
    }
})();