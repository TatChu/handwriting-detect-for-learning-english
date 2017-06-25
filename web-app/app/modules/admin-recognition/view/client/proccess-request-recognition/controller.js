var requestRecognitonDataCtrl = (function () {
    'use strict';

    angular
        .module('bzUser')
        .controller('requestRecognitonDataCtrl', requestRecognitonDataCtrl);

    function requestRecognitonDataCtrl($scope, $window, $state, $stateParams, $bzPopup, $uibModal, userRoles, authSvc, NgTableParams, ngTableEventsChannel, customResourceSrv) {
        /* jshint validthis: true */
        var vmURD = this;

        /*XÉT QUYỀN TRUY CẬP ROUTER*/
        if (!authSvc.isSuperAdmin()) {
            $state.go('error403');
        }
        /*END XÉT QUYỀN TRUY CẬP ROUTER*/

        // Vars
        vmURD.loading = true;
        vmURD.queryParams = $stateParams;
        vmURD.keyword = $stateParams.keyword;
        vmURD.role = $stateParams.role;
        vmURD.status = $stateParams.status;
        vmURD.userRoles = userRoles;
        // console.log('test', userRoles);
        vmURD.users = [];

        // Methods
        vmURD.filter = filter;
        vmURD.filterReset = filterReset;
        vmURD.active = active;
        vmURD.sort = sort;
        vmURD.remove = remove;

        // Init
        getData();

        ngTableEventsChannel.onPagesChanged(function () {
            $scope.vmURD.queryParams.page = vmURD.table.page();
            $state.go('.', $scope.vmURD.queryParams);
        }, $scope, vmURD.table);

        function getData() {
            customResourceSrv.api($window.settings.services.apiUrl + '/user')
                .get(vmURD.queryParams, function (resp) {
                    vmURD.queryParams.pageCount = resp.totalPage;
                    vmURD.users = resp.items;
                    vmURD.table = new NgTableParams({ count: parseInt(vmURD.queryParams.limit) || 10 }, {
                        counts: [],
                        getData: function (params) {
                            params.total(resp.totalItems);
                            return vmURD.users;
                        }
                    });
                    vmURD.table.page(vmURD.queryParams.page);
                    vmURD.loading = false;
                }, function (err) {
                    console.log(err);
                    $bzPopup.toastr({
                        type: 'error',
                        data: {
                            title: 'User',
                            message: err.data.message
                        }
                    });
                });
        }

        function filter(keyword) {
            $state.go('.', {
                role: vmURD.role != "" ? vmURD.role : null,
                keyword: keyword,
                status: vmURD.status != "" ? vmURD.status : null,
                page: 1
            }).then(function () {
                $state.reload();
            });
        }

        function filterReset() {
            $state.go('.', {
                role: null,
                keyword: null,
                page: vmURD.queryParams.page,
                status: null,
                // publish: null,
                // cateid: null,
                // limit: settingJs.admin.itemPerPage
            }, { notify: false })
                .then(function () {
                    $state.reload();
                });
        }

        function active(id, value) {
            customResourceSrv.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
                .update({ _id: id }, { status: value }, function (resp) {
                    $bzPopup.toastr({
                        type: 'success',
                        data: {
                            title: 'User',
                            message: value === 1 ? 'Kích hoạt tài khoản thành công!' : 'Vô hiệu hóa tài khoản thành công!'
                        }
                    });

                    $state.reload();
                });
        }

        function sort(id, value) {
            $bzPopup.toastr({
                type: 'success',
                data: {
                    title: 'Cập nhật',
                    message: 'Cập nhật thứ tự bài viết thành công!'
                }
            });
        }

        function remove(id) {
            var selected = { ids: [id] }; //id ? {ids: [id]} : getSelectedIds();

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'assets/global/message/view.html',
                controller: function ($scope, $uibModalInstance) {
                    $scope.popTitle = 'Xóa';
                    $scope.message = 'Bạn chắc chắn sẽ xóa dữ liệu này?';
                    $scope.ok = function () {
                        customResourceSrv.api($window.settings.services.apiUrl + '/user/:id', { id: '@id' })
                            .delete({ id: selected.ids }, function (resp) {
                                $bzPopup.toastr({
                                    type: 'success',
                                    data: {
                                        title: 'Xóa',
                                        message: 'Xóa tài khoản thành công!'
                                    }
                                });
                                $state.reload();
                                $uibModalInstance.close();
                            });
                    };
                }
            });
        }
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