'use start';

const Message = require('../../utils/message');

var successJson = function (response, handler) {
    return function (data) {
        console.log('success')
        response.jsonp({
            code: 100,
            message: Message[100],
            data: handler(data),
        });
    };
};

var errorJson = function (response) {
    return function (code) {
        if (!Message[code]) {
            console.error(code);
            code = 199;
        }

        response.jsonp({
            code: code,
            message: Message[code],
            data: null,
        });
    };
}

var currentTime = function () {
    return (new Date() - 0) / 1000;
}

exports.successJson = successJson;
exports.errorJson = errorJson;
exports.currentTime = currentTime;