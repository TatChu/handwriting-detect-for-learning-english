var category = (function () {
    'use strict';

    angular
        .module('bzProduct')
        .filter('productTag', productTag);

    function productTag() {
        return function (products, id_tags) {
            var out = [];
            if (id_tags) {
                var isAllFalse = Object.keys(id_tags).map(function(k) { return id_tags[k] }).find(function(item){
                    return item;
                });
                id_tags = isAllFalse ? id_tags : undefined;
            }

            if (!id_tags) {
                return products;
            }
            products.forEach(function (product) {
                var findTag = product.tag_processing.find(function (tag) {
                    return id_tags[tag.id_tag];
                })
                if (findTag) {
                    out.push(product);
                }
            })
            return out;
        }
    }
})();
