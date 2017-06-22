//send email 

exports.sendRegisterEmail = function (request, to, context) {
    let config = request.server.configManager;
    if (!to) {
        to = { name: request.payload.name, address: request.payload.email }
    }
    let emailData = {
        "from": config.get('web.email.from'),
        "to": to,
        "subject": "Tài khoản của bạn đã được tạo tại Mua Hàng Việt",
        "html": "Welcome",
        "template": {
            "name": "register",
            "context": context
        },
        "text": ""
    };

    let pubsub = request.server.plugins['app-pubsub'].pubsub;
    pubsub.publish('api-sendmail', emailData, function () {
        request.log(['info'], 'registration email published to queue');
    });
}

exports.sendForgotPasswordEmail = function (request, to, context) {
    let config = request.server.configManager;
    if (!to) {
        to = { name: request.payload.name, address: request.payload.email }
    }
    let emailData = {
        "from": config.get('web.email.from'),
        "to": to,
        "subject": "Yêu cầu thay đổi mât khẩu trên hệ thống Mua Hàng Việt",
        "html": "Forgot password",
        "template": {
            "name": "forgotpass",
            "context": context
        },
        "text": ""
    };

    let pubsub = request.server.plugins['app-pubsub'].pubsub;
    pubsub.publish('api-sendmail', emailData, function () {
        request.log(['info'], 'forgot password email published to queue');
    });
}

