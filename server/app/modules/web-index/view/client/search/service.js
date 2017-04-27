(function () {
    'use strict';

    angular
        .module('bzWebHome')
        .service('WebSearchSvc', WebSearchSvc)
        .factory('WebSearchFac', WebSearchFac);

    function WebSearchFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.apiUrl + '/:method/:id',
            { method: '@method', id: '@id' });
    }

    function WebSearchSvc($q, $window, WebSearchFac) {
        return {
            searchList: searchList,
            searchProduct: searchProduct,
            addSearch: addSearch,
            search: search
        };

        function searchList() {
            var searchList = new WebSearchFac();
            return searchList.$get({ method: 'search-list' });
        }

        function searchProduct() {
            var searchProduct = new WebSearchFac();
            return searchProduct.$get({ method: 'product-list' });
        }

        function addSearch(data) {
            data.method = 'add-search';
            var addSearch = new WebSearchFac(data);
            return addSearch.$get(data);
        }

        function search(data) {
            data.method = 'search';
            var addSearch = new WebSearchFac();
            return addSearch.$get(data);
        }

    }
})();