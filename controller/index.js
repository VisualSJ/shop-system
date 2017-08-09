'use strict';

const User = require('./lib/user');

// 主页
exports.home = function (request, response) {
    // 检查是否已经登录
    var isLoggedIn = User.isLoggedIn(request.cookies['ss_session']);
    if (isLoggedIn) {
        response.redirect('/user');
        return;
    }

    var username = request.body['username'];
    var password = request.body['password'];
    if (username && password) {
        User.login({
            username: username,
            password: password,
        }).then((session) => {
            response.cookie('ss_session', session, {
                // maxAge: 600000,
                httpOnly: true,
                path: '/',
                // secure: true,
            });
            response.redirect('/user');
        }).catch((error) => {
            console.log(error);

            response.clearCookie('ss_session', '', {
                // maxAge: 600000,
                httpOnly: true,
                path: '/',
                // secure: true,
            });
            response.render('home', {});
        });
        return;
    }

    response.render('home', {});
};

// 丢失页面 404
exports.missing = function (request, response) {
    response.send('404');
};