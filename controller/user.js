'use strict';

const User = require('./lib/user');

exports.index = function (request, response) {
    var session = request.cookies['ss_session'];
    if (!User.isLoggedIn(session)) {
        response.redirect('/');
        return;
    }

    response.render('user', {
        user: {},
    });
};

exports.address = function () {};

exports.warehouse = function () {};

exports.goods = function () {};

exports.order = function () {};

exports.register = function (request, response) {
    var username = request.body['username'];
    var password = request.body['password'];

    var error = function (error) {
        console.log(error);
        response.render('user-register', {});
    };

    var login = function () {
        // 注册完了以后自动登录
        User.login({
            username: username,
            password: password,
        }).then((session) => {
            response.cookie('ss_session', session, {
                maxAge: 600000,
                httpOnly: true,
                path: '/',
            });
            response.redirect('/user');
        }).catch(error);
    };

    if (username && password) {
        User.register({
            username: username,
            password: password,
        }).then(login).catch(error);
        return;
    }
    response.render('user-register', {});
};