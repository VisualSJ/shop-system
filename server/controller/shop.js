'use strict';

const Express = require('express');
const Router = Express();

const Database = require('../../database');
const MySQL = Database.MySQL;

const User = require('./lib/user');
const Filter = require('./lib/filter');

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
        error: {
            name: false,
        },
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
            let command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${sid}`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!sid) {
                return;
            }
            if (!list || !list[0]) {
                return Promise.reject(310);
            }
            responseData.shop = {
                sid: list[0].sid,
                name: list[0].name,
            };  
        })
        .then(() => {
            response.render('shop-item', responseData);
        })
        .catch((error) => {
            console.error(error);
            response.redirect('/');
        });
});

Router.post('/shop/item', (request, response) => {
    // 新建 Shop 或者是更新 Shop 的接口

    var responseData = {
        type: 'add',
        user: null,
        shop: null,
        error: {
            name: false
        },
    };

    // 过滤器内已经判断，所以这里必然存在这个属性
    var session = request.cookies.ss_session;
    var sid = request.query.sid;
    var name = request.body.name;

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
            let command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${sid}`);
            return MySQL.execute(command.toString());
        })
        // 更新 Shop 信息
        .then((list) => {
            if (!list || !list[0]) {
                return;
            }
            if (name < 6) {
                responseData.error.name = true;
                return;
            }
            var command = MySQL.sugar()
                .update('SHOP')
                .set('name', `'${name}'`)
                .where(`sid=${sid}`);
            return MySQL.execute(command.toString());
        })
        .then(() => {
            if (sid) {
                return;
            }
            if (name < 6) {
                responseData.error.name = true;
                return;
            }
            var command = MySQL.sugar()
                .insert('SHOP')
                .add('name', `'${name}'`)
                .add('uid', responseData.user.uid)
                .add('create_time', (new Date() - 0) / 1000);
            return MySQL.execute(command.toString());
        })
        .then(() => {
            response.redirect('/shop');
        })
        .catch((error) => {
            console.error(error);
            response.redirect('/');
        });
});

module.exports = Router;