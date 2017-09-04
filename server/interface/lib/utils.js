'use start';

const code = require('../../../lib/code');

var success = function (response, handler) {
    return function (data) {
        response.jsonp({
            code: 100,
            message: code[100],
            data: handler(data),
        });
    };
};

var failed = function (response) {
    return function (num) {
        if (!code[num]) {
            console.log(num);
            num = 199;
        }

        response.jsonp({
            code: num,
            message: code[num],
            data: null,
        });
    };
}

var currentTime = function () {
    return (new Date() - 0) / 1000;
}

exports.success = success;
exports.failed = failed;
exports.currentTime = currentTime;