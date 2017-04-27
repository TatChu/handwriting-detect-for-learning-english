var popupGenaratorCodeCtrl = (function () {
    'use strict';

    angular
        .module('bzCoupon')
        .controller('popupGenaratorCodeCtrl', popupGenaratorCodeCtrl);

    function popupGenaratorCodeCtrl($scope, $state, $uibModal, $uibModalInstance, authSvc) {
        /* jshint validthis: true */

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('coupon', ['add', 'edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Methods
        $scope.genaratorCode = genaratorCode;
        $scope.onTypeCode = onTypeCode;
        // Vars
        $scope.data = {
            code: '',
            qty: 2
        }
        $scope.submitted = false;
        // Init

        // Function
        function genaratorCode(form) {
            $scope.submitted = true;
            if (form.$valid && (($scope.data.code.split('*').length - 1) >= 3) && ($scope.data.code.indexOf('*') != -1)) {
                var tmp = $scope.data.code.split('*');
                var code = '';

                var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

                var genarator = function () {
                    if (code.split(',').length > $scope.data.qty) {
                        code = code.substring(0, code.length - 1);
                        return code;
                    } else {
                        var codetmp = '';
                        var j = 0;
                        for (j = 0; j <= tmp.length - 1; j++) {
                            codetmp = codetmp + tmp[j] + chars[Math.round(Math.random() * (chars.length - 1))];
                        }
                        codetmp = codetmp.substring(0, codetmp.length - 1);
                        if (code.indexOf(codetmp) == -1) {
                            code += codetmp;
                            code += ',';
                        }
                        genarator();
                    }
                }

                genarator();
                $uibModalInstance.close(code);
            }
        }

        function onTypeCode() {
            var tmp = $scope.data.code.split('*');
            tmp.forEach(function (t, i) {
                tmp[i] = textToSlug(t).toUpperCase();;
            });
            $scope.data.code = tmp.join('*');
        }

        function textToSlug(string) {
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
                slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;/gi, '');
                //Đổi khoảng trắng thành ký tự gạch ngang
                slug = slug.replace(/ /gi, "-");
                //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
                //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
                slug = slug.replace(/\-\-\-\-\-/gi, '-');
                slug = slug.replace(/\-\-\-\-/gi, '-');
                slug = slug.replace(/\-\-\-/gi, '-');
                slug = slug.replace(/\-\-/gi, '-');
                //Xóa các ký tự gạch ngang ở đầu và cuối
                // slug = '@' + slug + '@';
                // slug = slug.replace(/\@\-|\-\@|\@/gi, '');
                return slug;

            }

            return string;
        }
    }
})();