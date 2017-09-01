'use strict';

const Express = require('express');
const Router = Express();

const Filter = require('../utils/filter');
const User = require('../utils/user');

//////////////
// 声明过滤器 //
//////////////
Router.get('/', Filter.guest);
Router.get('/login', Filter.user);

/////////////////
// 定义具体的接口 //
/////////////////
Router.get('/', (request, response) => {
    // User 主要信息展示区域
    // 这里主要展示各种的数据统计信息
    
    // 过滤器内已经判断，所以这里必然存在这个属性
    var session = request.cookies.ss_session;

    User.getUser(session)
        .then((user) => {
            response.render('user', {
                user: user,
            });
        })
        .catch((error) => {
            console.error(error);
            response.redirect('/');
        });
});

Router.get('/login', (request, response) => {
    // 登录界面
    response.render('user-login');
});

Router.post('/login', (request, response, next) => {
    // 登录提交数据接口
    // 收到数据后对比，并跳转到指定页面
    // 如果登录失败，则重新显示登录页面，并返回错误

    var responseData = {
        error: {
            username: false,
            password: false,
        }
    };

    User.login({
        username: request.body.username,
        password: request.body.password,
    })
    .then((session) => {
        // 登录成功，跳转到信息展示页
        response.cookie('ss_session', session, {
            path: '/',
            httpOnly: true,
        });
        response.redirect('/user');
    })
    .catch((error) => {
        // 登录失败，重新渲染页面，并显示错误
        if (error === 201) responseData.error.username = true;
        if (error === 204) responseData.error.email = true;
        console.error(error);
        response.render('user-login', responseData);
    });
});

Router.get('/register', (request, response) => {
    // 注册页面
    response.render('user-register');
});

Router.post('/register', (request, response) => {
    // 注册提交数据接口
    // 收到数据后判断数据正确性，然后插入数据库
    // 并跳转指定页面

    var responseData = {
        error: {
            username: false,
            password: false,
            sex: false,
            email: false,
            phone: false,
        }
    };

    var username = request.body.username;
    var password = request.body.password;
    var sex = request.body.sex;
    var email = request.body.email;
    var phone = request.body.phone;

    // todo 检查属性正确性

    User.register({
        username: username,
        password: password,
        sex: sex,
        email: email,
        phone: phone,
    })
    .then(() => {
        return User.login({
            username: username,
            password: password,
        });
    })
    .then((session) => {
        response.cookie('ss_session', session, {
            path: '/',
            httpOnly: true,
        });
        response.redirect('/user');
    })
    .catch((error) => {
        if (error === 201) responseData.error.username = true;
        if (error === 204) responseData.error.email = true;
        console.error(error);

        response.render('user-register', responseData);
    });
});

Router.get('/logout', (request, response) => {
    // 退出登录
    User.logout(request.cookies.ss_session)
        .then(() => {
            response.clearCookie('ss_session', {
                path: '/',
                httpOnly: true,
            });
            response.redirect('/');
        });

});

module.exports = Router;