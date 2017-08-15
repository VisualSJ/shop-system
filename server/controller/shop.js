'use strict';

const Express = require('express');
const Router = Express();

const Database = require('../../database');
const MySQL = Database.MySQL;

const User = require('./lib/user');
const Shop = require('./lib/shop');
const Filter = require('./lib/filter');
const Code = require('./lib/code');

//////////////
// 声明过滤器 //
//////////////
Router.get('/shop', Filter.guest);
Router.get('/shop/item', Filter.guest);

/////////////////
// 定义具体的接口 //
/////////////////
Router.get('/shop', (request, response) => {
    // Shop 主要信息展示区域
    // 这里主要展示 Shop 的数据统计信息

    var responseData = {
        user: null,
        list: null,
    };
    
    // 过滤器内已经判断，所以这里必然存在这个属性
    var session = request.cookies.ss_session;

    User.getUser(session)
        .then((user) => {
            responseData.user = user;
        })
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP');
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            responseData.list = list;
        })
        .then(() => {
            response.render('shop', responseData);
        })
        .catch((error) => {
            console.error(error);
            response.redirect('/');
        });
});

Router.get('/shop/item', (request, response) => {
    // 显示 Shop 信息或者是新建 Shop 的页面

    var responseData = {
        type: 'add',
        user: null,
        shop: null,
        error: null,
    };

    // 过滤器内已经判断，所以这里必然存在这个属性
    var session = request.cookies.ss_session;
    var sid = request.query.sid;

    User.getUser(session)
        .then((user) => {
            responseData.user = user;
        })
        // 查询 Shop 信息
        .then(() => {
            if (!sid) {
                return;
            }
            responseData.type = 'update';
            return Shop.get(sid)
                .then((shop) => {
                    responseData.shop = shop;  
                });
        })
        .then(() => {
            response.render('shop-item', responseData);
        })
        .catch((error) => {
            if (error in Code) {
                console.error(error);
                responseData.error = Code[error];
                response.redirect('/shop/item', responseData);
            } else {
                console.error(error);
                response.redirect('/shop');
            }
        });
});

Router.post('/shop/item', (request, response) => {
    // 新建 Shop 或者是更新 Shop 的接口

    var responseData = {
        type: 'add',
        user: null,
        shop: null,
        error: null,
    };

    // 过滤器内已经判断，所以这里必然存在这个属性
    var session = request.cookies.ss_session;
    var sid = request.query.sid;
    var name = request.body.name;

    User.getUser(session)
        .then((user) => {
            responseData.user = user;
        })
        // 更新 Shop 信息
        .then(() => {
            if (!sid) {
                return;
            }
            // 查询 Shop 信息
            responseData.type = 'update';
            return Shop.update({
                sid: sid,
                name: name,
            });
        })
        // 新建商店
        .then(() => {
            if (sid) {
                return;
            }

            return Shop.register({
                name: name,
                uid: responseData.user.uid,
            });
        })
        .then(() => {
            response.redirect('/shop');
        })
        .catch((error) => {
            if (error in Code) {
                console.error(error);
                responseData.error = Code[error];
                response.redirect('/shop/item');
            } else {
                console.error(error);
                response.redirect('/shop');
            }
        });
});

module.exports = Router;