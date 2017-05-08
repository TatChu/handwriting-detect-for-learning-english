;
(function () {
    'use strict';

    Application.registerModule('bsLearning');

    angular
        .module('bsLearning', [])
        .constant('listTypesWord', [
            { name: 'Danh từ', value: 'noun' },
            { name: 'Đông từ', value: 'verb' },
            { name: 'Tính từ', value: 'adjective' },
            { name: 'Trạng tư', value: 'adverb' },
            { name: 'Đại từ nhân xưng', value: 'pronoun' },
            // { name: 'Lớp 6', value: 'conjunction' },
            // { name: 'Lớp 7', value: 'determiner' },
            // { name: 'Lớp 8', value: 'exclamation' },
        ]);
})();