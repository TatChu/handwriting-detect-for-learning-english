'use strict'

const CoreController = require('./controller/core.controller.js')

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/error404',
    config: {},
    handler: function (request, reply) {
      reply.view('admin-core/view/client/error/404', {
        meta: {
          title: 'Page Not Found'
        }
      }, {layout: 'admin/layout-error'})
    }
  })

  server.route({
    method: 'GET',
    path: '/error403',
    config: {},
    handler: function (request, reply) {
      reply.view('admin-core/view/client/error/403', {
        meta: {
          title: 'Not Permission'
        }
      }, {layout: 'admin/layout-error'})
    }
  })
  server.ext('onPostHandler', CoreController.createGuestToken);
  server.ext('onPostHandler', CoreController.getCredentials);
  server.ext('onPreResponse', CoreController.handleError);
  next()
}

exports.register.attributes = {
  name: 'admin-core'
}
