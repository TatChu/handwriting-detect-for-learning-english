//send email 

exports.sendRegisterEmail = function (request, to, context) {
    let config = request.server.configManager;
    if (!to) {
        to = { name: request.payload.name, address: request.payload.email }
    }
    let bcc = config.get('web.email.bcc')

    let emailData = {
        "from": config.get('web.email.from'),
        "to": to,
        "bcc": bcc,
        "subject": "[English Study System] Tài khoản của bạn đã được tạo tại English Study System",
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
        "subject": "[English Study System] Yêu cầu thay đổi mât khẩu trên hệ thống English Study System",
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

exports.sendEmailNotifyUpdatedDataNeural = function (request, to, context) {
    let config = request.server.configManager;
    if (!to) {
        to = { name: request.payload.name, address: request.payload.email }
    }
    let bcc = config.get('web.email.bcc')
    let emailData = {
        "from": config.get('web.email.from'),
        "to": to,
        "bcc": bcc,
        "subject": "[English Study System] Xử lý yêu cầu nhận dạng thành công",
        "html": "Updated",
        "template": {
            "name": "update-neural-success",
            "context": context
        },
        "text": ""
    };

    let pubsub = request.server.plugins['app-pubsub'].pubsub;
    pubsub.publish('api-sendmail', emailData, function () {
        request.log(['info'], 'registration email published to queue');
    });
}