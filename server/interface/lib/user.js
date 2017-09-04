'use strict';

const express = require('express');
const router = express();

const utils = require('./utils');
const crypto = require('crypto');
const user = require('../../../lib/user');

router.all('*', (request, response, next) =>{
    response.header("Access-Control-Allow-Origin", "*");
    response.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// ====================
// 登录
// ====================
router.all('/login', (request, response) => {
    var username = request.body.username;
    var password = request.body.password;

    if (!username) {
        let handler = utils.failed(response);
        handler(521);
    }

    if (!password) {
        let handler = utils.failed(response);
        handler(522);
    }

    var md5 = crypto.createHash('md5');
    md5.update(password);
    password = md5.digest('hex');

    user.query({
        name: username,
    }).then((user) => {
        if (!user) {
            return Promise.reject(521);
        }

        if (user.password !== password) {
            return Promise.reject(522);
        }

        request.session.user = user;
        return Promise.resolve(user);
    }).then(utils.success(response, (user) => {
        return {
            uid: user.uid,
        };
    })).catch(utils.failed(response));
});

// ====================
// 退出
// ====================
router.all('/logout', (request, response) => {
    delete request.session.user;
    let handler = utils.success(response, () => {
        return null;
    });
    handler();
});

// ====================
// 是否登录
// ====================
router.all('/isloggedin', (request, response) => {
    let user = request.session.user;
    let handler = utils.success(response, () => {
        return {
            isloggedin: !!user,
        };
    });
    handler();
});

// ====================
// 添加用户
// ====================
router.all('/add', (request, response) => {
    
});

// ====================
// 更新用户信息
// ====================
router.all('/update', (request, response) => {

});

// ====================
// 验证用户
// ====================
router.all('/verify', (request, response) => {

});

module.exports = router;