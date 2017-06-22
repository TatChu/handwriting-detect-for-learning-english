'use strict';

module.exports = {
    login: login
};

function login(request, reply) {
    let config = request.server.configManager;
    let cookieOptions = request.server.configManager.get('web.cookieOptions');
    let isAuth = request.auth.isAuthenticated;

    /*Nếu đã auth thì xét quyền truy cập page*/
    if (isAuth) {
        let roleAdmin = request.auth.credentials.scope.includes('admin');
        let roleSuperAdmin = request.auth.credentials.scope.includes('super-admin');
        let roleUser = request.auth.credentials.scope.includes('user');
        let roleGuest = request.auth.credentials.scope.includes('guest');
        let isAuth = request.auth.isAuthenticated;

        /*vào admin nếu có role admin hoặc super admin*/
        if (roleAdmin || roleSuperAdmin) {
            return reply.redirect(config.get('web.context.cmsprefix'));
        }

        /*vào trang chủ nếu có role user*/
        if (!(roleAdmin || roleSuperAdmin) && roleUser) {
            return reply.redirect('/');
        }
    }
    reply.view('admin-auth/view/login', null, { layout: 'admin/layout-admin-login' });
}