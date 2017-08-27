'use strict';

const Express = require('express');
const Router = Express();

const User = require('./lib/user');
const Shop = require('./lib/shop');
const Utils = require('./lib/utils');

Router.all('/shop/add', (request, response) => {
    Promise.resolve({
        user: null,
        shop: null,
    })
    .then(User.isLoggedIn(request))
    .then(Shop.duplicationName(request))
    .then(Shop.userLimit(request))
    .then(Shop.insert(request))
    .then(Shop.attachShopMap(request))
    .then(Utils.successJson(response, (data) => {
        return {
            sid: data.sid,
            name: data.name,
        };
    }))
    .catch(Utils.errorJson(response));
});

Router.all('/shop/item', (request, response) => {
    Promise.resolve({
        user: null,
        shop: null,
        admins: null,
    })
    .then(User.isLoggedIn(request))
    .then(Shop.isAdmin(request))
    .then(Shop.queryItem(request))
    .then(Shop.queryAdminList(request))
    .then(Utils.successJson(response, (data) => {
        return {
            sid: data.shop.sid,
            name: data.shop.name,
            founder: data.shop.uid,
            admins: data.admins,
        };
    }))
    .catch(Utils.errorJson(response));
});

Router.all('/shop/list', (request, response) => {
    Promise.resolve({
        user: null,
        sids: null, // 显示的商店 sid 列表
        shops: null,
    })
    .then(User.isLoggedIn(request))
    .then(Shop.queryUserShopSidList(request))
    .then(Shop.queryShopFromSids(request))
    .then(Utils.successJson(response, (data) => {
        return {
            uid: data.user.uid,
            shops: data.shops,
        };
    }))
    .catch(Utils.errorJson(response));

});

Router.all('/shop/add-admin', (request, response) => {
    Promise.resolve({
        user: null,
    })
    .then(User.isLoggedIn(request))
    .then(Shop.isAdmin(request))
    .then(Shop.insertAdmin(request))
    .then(Utils.successJson(response, (data) => {
        return null;
    }))
    .catch(Utils.errorJson(response));
});

// ///////////////
// // WAREHOUSE //
// ///////////////

// Router.all('/warehouse/add', (request, response) => {
//     var sid = request.query.sid || request.body.sid;
//     var name = request.query.name || request.body.name;
//     var remark = request.query.remark || request.body.remark;

//     var user;
//     CHECK_USER(request.cookies.ss_session)
//         .then((data) => {
//             user = data;
//         })
//         // 检查数据
//         .then(() => {
//             sid -= 0;
//             if (!sid || isNaN(sid)) {
//                 return Promise.reject(401);
//             }
//             if (!name) {
//                 return Promise.reject(401);
//             }
//             return Promise.resolve();
//         })
//         // 检查 sid 商店是否允许该用户修改
//         .then(() => {
//             var command = MySQL.sugar()
//                 .select('*')
//                 .from('SHOP')
//                 .where(`uid=${user.uid}`)
//                 .where(`sid=${sid}`);

//             return MySQL.execute(command.toString());
//         })
//         .then((list) => {
//             if (!list || list.length <= 0) {
//                 return Promise.reject(412);
//             }
//             return Promise.resolve();
//         })
//         // 检查商店是否超出仓库限制
//         .then(() => {
//             var command = MySQL.sugar()
//                 .select('wid')
//                 .from('WAREHOUSE')
//                 .where(`sid=${sid}`);
            
//             return MySQL.execute(command.toString());
//         })
//         .then((list) => {
//             if (list.length >= 2) {
//                 return Promise.reject(415);
//             }
//             return Promise.resolve();
//         })
//         // 检查用户是否超出仓库限制
//         .then(() => {
//             var command = MySQL.sugar()
//                 .select('wid')
//                 .from('WAREHOUSE')
//                 .where(`uid=${user.uid}`);
            
//             return MySQL.execute(command.toString());
//         })
//         .then((list) => {
//             if (list.length >= 4) {
//                 return Promise.reject(416);
//             }
//             return Promise.resolve();
//         })
//         // 插入仓库信息
//         .then(() => {
//             var command = MySQL.sugar()
//                 .insert('WAREHOUSE')
//                 .add('sid', sid)
//                 .add('name', `'${name}'`)
//                 .add('remark', `'${remark || ''}'`)
//                 .add('uid', user.uid)
//                 .add('create_time', Math.floor((new Date() - 0) / 1000));

//             return MySQL.execute(command.toString());
//         })
//         // 查询插入的信息
//         .then((data) => {
//             var command = MySQL.sugar()
//                 .select('*')
//                 .from('WAREHOUSE')
//                 .where(`wid=${data.insertId}`);

//             return MySQL.execute(command.toString());
//         })
//         .then((list) => {
//             return Promise.resolve(list[0]);
//         })
//         // 返回成功信息
//         .then((data) => {
//             response.jsonp({
//                 code: 400,
//                 message: Message[400],
//                 data: data,
//             });
//         })
//         .catch(ERROR_HANDLER(response));

// });

module.exports = Router;