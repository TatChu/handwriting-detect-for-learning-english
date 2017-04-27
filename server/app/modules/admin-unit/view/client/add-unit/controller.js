var unitsCtrl = (function () {
    'use strict';

    angular
        .module('bzUnit')
        .controller('unitAddCtrl', unitAddCtrl);

    function unitAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, unitSvc, listClasses) {
        /* jshint validthis: true */
        var vmAddUnits = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('unit', ['add'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmAddUnits.formData = {
            index_unit: 1,
            classes: '4',
            status: true
        };
        vmAddUnits.lockFOrm = false;
        vmAddUnits.save = create;
        vmAddUnits.submitted = false;
        vmAddUnits.listClasses = listClasses;
        //Init
      
        function create(isValid) {
            vmAddUnits.submitted = true;
            vmAddUnits.lockForm = true;
            if (isValid) {
                unitSvc.create(vmAddUnits.formData).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Bài học',
                            message: 'Thêm thành công'
                        }
                    });
                $state.go('units');
                }).catch(function (error) {
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Thêm bài học',
                            message: error.data
                        }
                    });
                });
            }
            else {
                vmAddUnits.submitted = true;
            }
        };
    }

    var resolve = {
        /* @ngInject */
        preload: function (bzPreloadSvc) {
            return bzPreloadSvc.load([]);
        }
    };

    return {
        resolve: resolve
    };
})();