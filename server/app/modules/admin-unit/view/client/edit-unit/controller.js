var unitsCtrl = (function () {
    'use strict';

    angular
        .module('bzUnit')
        .controller('unitEditCtrl', unitAddCtrl);

    function unitAddCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal,
        userRoles, authSvc, NgTableParams, ngTableEventsChannel, bzResourceSvc, unitSvc) {
        var vmEditUnits = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!(authSvc.isSuperAdmin() || (authSvc.isAdmin() && authSvc.hasPermission('unit', ['edit'])))) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmEditUnits.lockFOrm = false;
        vmEditUnits.save = update;
        vmEditUnits.vmEditUnits = getUnit;
        vmEditUnits.submitted = false;

        //Init
        getUnit();

        function getUnit() {
            const id = $stateParams.id;
            unitSvc.get(id).then(function (res) {
                vmEditUnits.formData = res;
            }).catch(function (err) {
                $bzPopup.toastr({
                    type: 'error',
                    data: {
                        title: 'Getting',
                        message: err.data
                    }
                });
            });
        };

        function update(isValid) {
            vmEditUnits.submitted = true;
            vmEditUnits.lockForm = true;
            if (isValid) {
                unitSvc.update(vmEditUnits.formData, vmEditUnits.formData._id).then(function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'Đơn vị',
                            message: resp.message
                        }
                    });
                    $state.go('units');
                }).catch(function (error) {
                    // console.log('error', error);
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'Cập nhật đơn vị',
                            message: error.data.message
                        }
                    });
                });
            }
            else {
                vmEditUnits.submitted = true;
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