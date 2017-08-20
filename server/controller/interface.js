'use strict';

const Express = require('express');
const Router = Express();

const Database = require('../../database');
const MySQL = Database.MySQL;

const Message = require('./lib/message');
const User = require('./lib/user');
const Shop = require('./lib/shop');

const ERROR_HANDLER = function (response) {
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

const CHECK_USER = function (session) {
    return Promise.resolve()
        // 用户登录状态
        .then(() => {
            var isLoggedIn = User.isLoggedIn(session);
            if (isLoggedIn) {
                return Promise.resolve();
            } else {
                return Promise.reject(102);
            }
        })
        // 获取用户信息
        .then(() => {
            return User.getUser(session);
        });
};

//////////
// SHOP //
//////////

/**
 * 新建商店
 * /interface/shop/add?name=测试商店
 */
Router.all('/shop/add', (request, response) => {

    var name = request.body.name || request.query.name;

    var user, sid;
    CHECK_USER(request.cookies.ss_session)
        .then((data) => {
            user = data;
        })
        // 校验参数
        .then(() => {
            sid -= 0;
            if (!sid || isNaN(sid)) {
                return Promise.reject(401);
            }
            return Promise.resolve();
        })
        // 检查是否超出用户允许新建的商店数量
        .then(() => {
            var command = MySQL.sugar()
                .select('sid')
                .from('SHOP')
                .where(`uid=${user.uid}`);
            
            return MySQL.execute(command.toString());
        })
        // 检查是否超出用户允许新建的商店数量
        .then((list) => {
            if (list.length >= 3) {
                return Promise.reject(304);
            }
            return Promise.resolve();
        })
        // 注册新商店
        .then(() => {
            if (name.length <= 2 || name.length >= 10) {
                return Promise.reject(302);
            }
            return Shop.register({
                name: name,
                uid: user.uid,
            });
        })
        .then((data) => {
            sid = data.insertId;
        })
        // 插入商店用户关联信息
        .then(() => {
            var command = MySQL.sugar()
                .insert('USER_SHOP_MAP')
                .add('sid', sid)
                .add('uid', user.uid)
                .add('create_time', Math.floor((new Date() - 0) / 1000));

            return MySQL.execute(command.toString());
        })
        // 查询插入的信息
        .then(() => {
            return Shop.get(sid);
        })
        // 返回成功信息
        .then((data) => {
            response.jsonp({
                code: 400,
                message: Message[400],
                data: data,
            });
        })
        // 错误处理
        .catch(ERROR_HANDLER(response));
});

/**
 * 查询用户可以访问的商店列表
 * /interface/shop/list
 */
Router.all('/shop/list', (request, response) => {
    var num = 10; // 每页显示 10 个
    var page = request.query.page - 0; // 1+
    if (!page || isNaN(page)) {
        page = 1;
    }
    
    var user;
    CHECK_USER(request.cookies.ss_session)
        .then((data) => {
            user = data;
        })
        // 查询与用户相关的商店 sid
        .then(() => {
            var command = MySQL.sugar()
                .select('sid')
                .from('USER_SHOP_MAP')
                .where(`uid=${user.uid}`)
                .limit((page - 1) * num, num);
            
            return MySQL.execute(command.toString());
        })
        // 根据 sid 查询商店信息
        .then((list) => {
            var tasks = list.map((item) => {
                var command = MySQL.sugar()
                    .select('*')
                    .from('SHOP')
                    .where(`sid=${item.sid}`);

                return MySQL.execute(command.toString());
            });
            return Promise.all(tasks);
        })
        // 整理返回数据
        .then((list) => {
            var data = list.map((item) => {
                return item[0];
            });
            response.jsonp({
                code: 400,
                message: Message[400],
                data: {
                    page: page,
                    list: data,
                },
            });
        })
        .catch(ERROR_HANDLER(response));
});

/**
 * 显示商店详情
 * /interface/shop/item?sid=1
 */
Router.all('/shop/item', (request, response) => {
    var responseData = {
        owner: null,
        admin: [],
        name: [],
    };

    var sid = request.body.sid || request.query.sid;
    var user;
    
    CHECK_USER(request.cookies.ss_session)
        .then((data) => {
            user = data;
        })
        .then(() => {
            sid -= 0;
            if (!sid || isNaN(sid)) {
                return Promise.reject(401);
            }
            return Promise.resolve();
        })
        // 检查是否允许当前用户访问该 sid 商店
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('USER_SHOP_MAP')
                .where(`sid=${sid}`)
                .where(`uid=${user.uid}`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || list.length <= 0) {
                return Promise.reject(412);
            }
            return Promise.resolve();
        })
        // 根据 sid 查询商店信息
        .then((list) => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${sid}`);

            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || !list[0]) {
                return Promise.reject(410);
            }
            responseData.name = list[0].name;
            responseData.owner = list[0].uid;
            return Promise.resolve();
        })
        // 根据商店 sid 查询管理员
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('USER_SHOP_MAP')
                .where(`sid=${sid}`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            return Promise.all(list.map((item) => {
                var command = MySQL.sugar()
                    .select('*')
                    .from('USER')
                    .where(`uid=${item.uid}`);
                return MySQL.execute(command.toString());
            }));
        })
        .then((list) => {
            list = list.forEach((item) => {
                responseData.admin.push(item[0]);
            });
            response.jsonp({
                code: 400,
                message: Message[400],
                data: responseData,
            });
        })
        .catch(ERROR_HANDLER(response));
});

/**
 * 添加管理员
 * /interface/shop/add-admin?sid=1&uid=2
 */
Router.all('/shop/add-admin', (request, response) => {
    var sid = request.query.sid;
    var uid = request.query.uid;

    var user;
    CHECK_USER(request.cookies.ss_session)
        .then((data) => {
            user = data;
        })
        // 检查参数
        .then(() => {
            sid -= 0;
            if (!sid || isNaN(sid)) {
                return Promise.reject(401);
            }
            return Promise.resolve();
        })
        // 根据 sid 查询商店信息
        .then((list) => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${sid}`);

            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || !list[0]) {
                return Promise.reject(410);
            }
            var item = list[0];
            if (item.uid != user.uid) {
                return Promise.reject(411);
            }
            if (item.uid == uid) {
                return Promise.reject(413);
            }
            return Promise.resolve();
        })
        // 检查是否已经是管理员
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('USER_SHOP_MAP')
                .where(`uid=${uid}`)
                .where(`sid=${sid}`);
            
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (list.length > 0) {
                return Promise.reject(413);
            }
            return Promise.resolve();
        })
        // 插入商店用户关联信息
        .then(() => {
            var command = MySQL.sugar()
                .insert('USER_SHOP_MAP')
                .add('sid', sid)
                .add('uid', uid)
                .add('create_time', Math.floor((new Date() - 0) / 1000));

            return MySQL.execute(command.toString());
        })
        // 整理返回数据
        .then(() => {
            response.jsonp({
                code: 400,
                message: Message[400],
                data: null,
            });
        })
        .catch(ERROR_HANDLER(response));
});

/**
 * 移除管理员
 * /interface/shop/remove-admin?sid=1&uid=2
 */
Router.all('/shop/remove-admin', (request, response) => {
    var sid = request.query.sid;
    var uid = request.query.uid;

    var user;
    CHECK_USER(request.cookies.ss_session)
        .then((data) => {
            user = data;
        })
        // 检查数据
        .then(() => {
            sid -= 0;
            if (!sid || isNaN(sid)) {
                return Promise.reject(401);
            }
            return Promise.resolve();
        })
        // 根据 sid 查询商店信息
        .then((list) => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${sid}`);

            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || !list[0]) {
                return Promise.reject(410);
            }
            var item = list[0];
            if (item.uid != user.uid) {
                return Promise.reject(411);
            }
            if (item.uid == uid) {
                return Promise.reject(414);
            }
            return Promise.resolve();
        })
        // 删除商店用户关联信息
        .then(() => {
            var command = MySQL.sugar()
                .delete('USER_SHOP_MAP')
                .where(`sid=${sid}`)
                .where(`uid=${uid}`);
            return MySQL.execute(command.toString());
        })
        // 整理返回数据
        .then(() => {
            response.jsonp({
                code: 400,
                message: Message[400],
                data: null,
            });
        })
        .catch(ERROR_HANDLER(response));
});

///////////////
// WAREHOUSE //
///////////////

Router.all('/warehouse/add', (request, response) => {
    var sid = request.query.sid || request.body.sid;
    var name = request.query.name || request.body.name;
    var remark = request.query.remark || request.body.remark;

    var user;
    CHECK_USER(request.cookies.ss_session)
        .then((data) => {
            user = data;
        })
        // 检查数据
        .then(() => {
            sid -= 0;
            if (!sid || isNaN(sid)) {
                return Promise.reject(401);
            }
            if (!name) {
                return Promise.reject(401);
            }
            return Promise.resolve();
        })
        // 检查 sid 商店是否允许该用户修改
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`uid=${user.uid}`)
                .where(`sid=${sid}`);

            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || list.length <= 0) {
                return Promise.reject(412);
            }
            return Promise.resolve();
        })
        // 检查商店是否超出仓库限制
        .then(() => {
            var command = MySQL.sugar()
                .select('wid')
                .from('WAREHOUSE')
                .where(`sid=${sid}`);
            
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (list.length >= 2) {
                return Promise.reject(415);
            }
            return Promise.resolve();
        })
        // 检查用户是否超出仓库限制
        .then(() => {
            var command = MySQL.sugar()
                .select('wid')
                .from('WAREHOUSE')
                .where(`uid=${user.uid}`);
            
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (list.length >= 4) {
                return Promise.reject(416);
            }
            return Promise.resolve();
        })
        // 插入仓库信息
        .then(() => {
            var command = MySQL.sugar()
                .insert('WAREHOUSE')
                .add('sid', sid)
                .add('name', `'${name}'`)
                .add('remark', `'${remark || ''}'`)
                .add('uid', user.uid)
                .add('create_time', Math.floor((new Date() - 0) / 1000));

            return MySQL.execute(command.toString());
        })
        // 查询插入的信息
        .then((data) => {
            var command = MySQL.sugar()
                .select('*')
                .from('WAREHOUSE')
                .where(`wid=${data.insertId}`);

            return MySQL.execute(command.toString());
        })
        .then((list) => {
            return Promise.resolve(list[0]);
        })
        // 返回成功信息
        .then((data) => {
            response.jsonp({
                code: 400,
                message: Message[400],
                data: data,
            });
        })
        .catch(ERROR_HANDLER(response));

});

module.exports = Router;