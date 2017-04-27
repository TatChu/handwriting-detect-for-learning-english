(function () {
    'use strict';

    angular
        .module('bzProduct')
        .service('productSvc', productSvc)
        .service('productFac', productFac)
        .service('apiFac', apiFac);

    function productFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.admin + '/:method/:id', { method: '@method', id: '@id' });
    }

    function apiFac($window, bzResourceSvc) {
        return bzResourceSvc.api($window.settings.services.apiUrl + '/:method/:id', { method: '@method', id: '@id' });
    }

    function productSvc($q, $window, bzResourceSvc, productFac, apiFac) {
        return {
            getAll: getAll,
            get: get,
            add: add,
            create: create,
            updateProduct: updateProduct,
            deleteProduct: deleteProduct,
            activeProduct: activeProduct,
            getProductBySlug: getProductBySlug,
            updateTag: updateTag,
            getProductByID: getProductByID,
            formatYoutube: formatYoutube,
            uploadBase64: uploadBase64,
            thumbToImage: thumbToImage,
            imageToThumb: imageToThumb,
            testResize: testResize,
            changeToSlug: changeToSlug,
            checkImgOld: checkImgOld,
            fixImgProductDetail: fixImgProductDetail
        };

        function getAll(query) {
            query.method = 'product';
            var getAll = new productFac();
            return getAll.$get(query);
        }

        function get(id) {
            var getByID = new productFac();
            return getByID.$get({ method: 'product', id: id });
        }

        function add(data) {
            var addData = new productFac(data);
            return addData.$get({ method: 'product-add' });
        }

        function create(data) {
            var createData = new productFac(data);
            return createData.$save({ method: 'product' });
        }
        function updateProduct(data, id) {
            var updateData = new productFac(data);
            return updateData.$save({ method: 'product', id: id });
        }

        function deleteProduct(id) {
            var deleteData = new productFac();
            return deleteData.$delete({ method: 'product', id: id });
        }

        function activeProduct(id) {
            var activeData = new productFac();
            return activeData.$save({ method: 'product-active', id: id });
        }

        function getProductBySlug(slug) {
            var getProduct = new productFac();
            return getProduct.$get({ method: 'product-edit', id: slug });
        }

        function getProductByID(id) {
            var getProduct = new productFac();
            return getProduct.$get({ method: 'product-edit', id: id });
        }

        function updateTag(data) {
            var updateTag = new productFac(data);
            return updateTag.$save({ method: 'product-tag' });
        }

        function uploadBase64(data) {
            var updateTag = new apiFac(data);
            return updateTag.$save({ method: 'upload', id: 'base64' });
        }

        function formatYoutube(link) {
            if (link.indexOf("watch?v=") != -1)
                link = link.replace('watch?v=', 'embed/');
            if (link.indexOf("&") != -1) {
                link = link.split('&')[0];
            }
            return link;
        }

        function thumbToImage(name) {
            var thumb_split = name.split('.');
            var thumb_name_split = thumb_split[0].split('_');
            thumb_name_split.pop();
            var image_name = thumb_name_split.join('_') + '.' + thumb_split[1];
            return image_name;
        }

        function imageToThumb(name) {
            var thumb_split = name.split('.');
            return thumb_split[0] + '_248x248.' + thumb_split[1]
        }

        function testResize(data) {
            var test = new productFac(data);
            return test.$save({ method: 'test-resize' });
        }

        function changeToSlug(string) {
            if (string) {
                //Đổi chữ hoa thành chữ thường
                var slug = string.toLowerCase();

                //Đổi ký tự có dấu thành không dấu
                slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
                slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
                slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
                slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
                slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
                slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
                slug = slug.replace(/đ/gi, 'd');
                //Xóa các ký tự đặt biệt
                slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
                //Đổi khoảng trắng thành ký tự gạch ngang
                slug = slug.replace(/ /gi, "-");
                //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
                //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
                slug = slug.replace(/\-\-\-\-\-/gi, '-');
                slug = slug.replace(/\-\-\-\-/gi, '-');
                slug = slug.replace(/\-\-\-/gi, '-');
                slug = slug.replace(/\-\-/gi, '-');
                //Xóa các ký tự gạch ngang ở đầu và cuối
                slug = '@' + slug + '@';
                slug = slug.replace(/\@\-|\-\@|\@/gi, '');
                return slug;

            }

            return string;
        }

        // Fix for transfer database
        function checkImgOld(new_url, image) {
            if (image) {
                var tmp_arr = image.split('/');
                if (tmp_arr.length > 1) {
                    var url = settingJs.configs.uploadDirectory.media_old_product.slice(0, -1);
                    return url + image;
                }
            }

            return new_url + image;
        }

        function fixImgProductDetail(content) {
            let urlReplaceLeft = new RegExp('{{media url="', 'g');
            let urlReplaceRight = new RegExp('"}}', 'g');
            let replaceUrl2 = new RegExp("//mhv-live.bizzon.com.vn", 'g')

            return content.replace(urlReplaceLeft, settings.services.webUrl + settingJs.configs.uploadDirectory.media_old).replace(urlReplaceRight, '').replace(replaceUrl2, settings.services.webUrl);
        }
    }
})();