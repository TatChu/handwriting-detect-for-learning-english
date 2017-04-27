;
(function () {
    'use strict';

    Application.registerModule('bzUnit');

    angular
        .module('bzUnit', [])
        .constant('listClasses', [
            { name: "Lớp 1", value: "1" },
            { name: "Lớp 2", value: "2" },
            { name: "Lớp 3", value: "3" },
            { name: "Lớp 4", value: "4" },
            { name: "Lớp 5", value: "5" },
            { name: "Lớp 6", value: "6" },
            { name: "Lớp 7", value: "7" },
            { name: "Lớp 8", value: "8" },
            { name: "Lớp 9", value: "9" },
            { name: "Lớp 10", value: "10" },
            { name: "Lớp 11", value: "11" },
            { name: "Lớp 12", value: "12" },
            { name: "Khác", value: "khac" },
        ]);
})();