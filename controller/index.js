'use strict';

const User = require('./user');

// 主页
exports.home = function (request, response) {
    var username = request.param('username');
    var password = request.param('password');
    if (username && password) {
        User.register({
            username: username,
            password: password,
        }).then(() => {

        }).catch((error) => {
            console.log(error);
        });
    }
    response.render('home', {});
};

// 丢失页面 404
exports.missing = function (request, response) {
    response.send('404');
};