;
(function () {
    'use strict';

    Application.registerModule('bzPermisstion');

    angular
        .module('bzPermisstion', [])
        .constant('listResource', [
            'dashboard', 'blog', 'product', 'user', 'promotion', 'order', 'unit', 'supplier',
            'category', 'shipping', 'tag', 'coupon', 'config', 'certificate', 'import_product',
            'search', 'acl', 'log'
        ])
        .constant('listAction', [
            { name: 'Xem', value: 'view' },
            { name: 'Thêm', value: 'add' },
            { name: 'Sửa', value: 'edit' },
            { name: 'Xoá', value: 'delete' },
            { name: 'Trích xuất', value: 'export' },
        ]);
    // .constant('listRole', [
    //     { name: 'Admin', value: 'admin' },
    //     { name: 'Super Admin', value: 'supper-admin' },
    //     { name: 'User', value: 'user' },
    //     { name: 'Student', value: 'student' },
    //     { name: 'Guest', value: 'guest' }
    // ]);
})();