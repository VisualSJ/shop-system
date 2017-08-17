'use strict';

const Database = require('../../../database');
const MySQL = Database.MySQL;

/**
 * 传入 sid 查找对应的商店信息
 * @param {*} sid 
 */
var get = function (sid) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    return Promise.resolve()
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${sid}`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || list.length <= 0) {
                return Promise.reject(310);
            }
            return Promise.resolve(list[0]);
        });
};

/**
 * 获取一个列表
 * @param {*} page 页码 
 * @param {*} count 每页数量
 */
var getList = function (page, count) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    return Promise.resolve()
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .limit((page - 0)*count, count);
            return MySQL.execute(command.toString());
        });
};

/**
 * 注册商店
 * info {
 *   name
 * }
 */
var register = function (info) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    return Promise.resolve()
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`name='${info.name}'`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || list.length <= 0) {
                return Promise.resolve();
            }
            return Promise.reject(301);
        })
        .then(() => {
            if (!info.name || info.name.length < 2) {
                return Promise.reject(302);
            }
            if (!info.uid) {
                return Promise.reject(303);
            }
            var command = MySQL.sugar()
                .insert('SHOP')
                .add('name', `'${info.name}'`)
                .add('uid', `${info.uid}`)
                .add('create_time', (new Date() - 0) / 1000);
            return MySQL.execute(command.toString());
        });
};

/**
 * 更新商店信息
 * 
 * info {
 *   name
 * }
 */
var update = function (info) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    return Promise.resolve()
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`name='${info.name}'`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || list.length <= 0) {
                return Promise.resolve();
            }
            return Promise.reject(301);
        })
        .then(() => {
            if (!info.name || info.name.length < 2) {
                return Promise.reject(302);
            }
            if (!info.sid) {
                return Promise.reject(310);
            }
            var command = MySQL.sugar()
                .update('SHOP')
                .set('name', `'${info.name}'`)
                .where(`sid=${info.sid}`);
            return MySQL.execute(command.toString());
        });
};

exports.get = get;
exports.register = register;
exports.update = update;
exports.getList = getList;