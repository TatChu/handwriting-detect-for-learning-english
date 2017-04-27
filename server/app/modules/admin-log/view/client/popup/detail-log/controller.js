var popupLogCtrl = (function () {
    'use strict';

    angular
        .module('bzAuditLog')
        .controller('popupLogCtrl', popupLogCtrl);

    function popupLogCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal, $uibModalInstance,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, detailLog) {
        $scope.log = detailLog;
        $scope.log.object = JSON.parse($scope.log.object);
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Methods

        // Vars

    }
})();