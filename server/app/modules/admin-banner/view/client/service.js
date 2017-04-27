(function () {
    'use strict';

    angular
        .module('bzBanner')
        .service('bannerSvc', bannerSvc)
        .service('bannerFac', bannerFac);

    function bannerFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function bannerSvc($q, $window, bzResourceSvc, bannerFac) {
        return {
            getAll: getAll,
            getHomeTop: getHomeTop,
            getHomeBanner: getHomeBanner,
            getCategoryTop: getCategoryTop,
            create: create,
            update: update,
            del: del
        };

        function getAll(data) {
            data.method = 'banner';
            var bannerList = new bannerFac();
            return bannerList.$get(data);
        }

        function getHomeTop() {
            var banner = new bannerFac();
            return banner.$get({ method: 'banner' });
        }

        function getHomeBanner() {
            var banner = new bannerFac();
            return banner.$get({ method: 'banner' });
        }

        function getCategoryTop() {
            var banner = new bannerFac();
            return banner.$get({ method: 'banner' });
        }

        function update(data, id) {
            var bannerUpdate = new bannerFac(data);
            return bannerUpdate.$save({ method: 'banner', id: id });
        }

        function create(data) {
            var createData = new bannerFac(data);
            return createData.$save({ method: 'banner' });
        }

        function del(id) {
            var deleteData = new bannerFac();
            return deleteData.$delete({ method: 'banner', id: id });
        }
    }
})();