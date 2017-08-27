'use strict';

const Database = require('../../../database');
const MySQL = Database.MySQL;

const Utils = require('./utils');

//----------
// 新建商店
//----------

/**
 * 用户创建的商店上限
 * @param {*} request 
 */
var userLimit = function (request) {
    return function (data) {
        if (!data.user) {
            return Promise.reject(102);
        }

        var command = MySQL.sugar()
            .select('*')
            .from('SHOP')
            .where(`uid='${data.user.uid}'`)
            .toString();

        var checkLength = function (list) {
            if (list.length >= 2) {
                return Promise.reject(304);
            }
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(checkLength);
    };
};

/**
 * 是否重名
 * @param {*} request 
 */
var duplicationName = function (request) {
    var name = request.body.name || request.query.name;
    return function (data) {
        if (!data.user) {
            return Promise.reject(102);
        }

        var check = function (list) {
            if (list && list.length > 0) {
                return Promise.reject(301);
            }
            return Promise.resolve(data);
        };

        var command = MySQL.sugar()
            .select('sid')
            .from('SHOP')
            .where(`name='${name}'`)
            .toString();

        return MySQL.execute(command).then(check);
    };
};

/**
 * 插入新商店
 * @param {*} request 
 */
var insert = function (request) {
    var name = request.body.name || request.query.name;
    return function (data) {
        if (!data.user) {
            return Promise.reject(102);
        }
    
        if (!name || !/\S{2,6}/.test(name)) {
            return Promise.reject(302);
        }

        var command = MySQL.sugar()
            .insert('SHOP')
            .add('name', `'${name}'`)
            .add('uid', data.user.uid)
            .add('create_time', Utils.currentTime())
            .toString();

        var query = function (data) {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${data.insertId}`)
                .toString();

            return MySQL.execute(command);
        };

        var attachShop = function (list) {
            data.shop = list[0];
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(query).then(attachShop);
    };
};

/**
 * 插入用户商店关联信息
 * @param {*} request 
 */
var attachShopMap = function (request) {
    return function (data) {
        
        var command = MySQL.sugar()
            .insert('USER_SHOP_MAP')
            .add('sid', data.shop.sid)
            .add('uid', data.user.uid)
            .add('create_time', Math.floor((new Date() - 0) / 1000))
            .toString();

        var finish = function () {
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(finish);
    };
};

exports.userLimit = userLimit;
exports.duplicationName = duplicationName;
exports.insert = insert;
exports.attachShopMap = attachShopMap;

//----------
// 查询商店
//----------

/**
 * 查询是否是管理员
 * @param {*} request 
 */
var isAdmin = function (request) {
    var sid = request.body.sid || request.query.sid;
    return function (data) {
        if (!sid) {
            return Promise.reject(401);
        }

        var command = MySQL.sugar()
            .select('*')
            .from('USER_SHOP_MAP')
            .where(`sid=${sid}`)
            .where(`uid=${data.user.uid}`)
            .toString();

        var allow = function (list) {
            if (!list || !list[0] || list.length <= 0) {
                return Promise.reject(404);
            }
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(allow);
    };
};

/**
 * 查询单个商店的信息
 * @param {*} request 
 */
var queryItem = function (request) {
    var sid = request.body.sid || request.query.sid;
    return function (data) {
        if (!sid) {
            return Promise.reject(401);
        }

        var command = MySQL.sugar()
            .select('*')
            .from('SHOP')
            .where(`sid=${sid}`)
            .toString();

        var finish = function (list) {
            data.shop = list[0];
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(finish);
    };
};

/**
 * 查询一个商店的管理员列表
 * 返回的是一个 uid 的数组
 * @param {*} request 
 */
var queryAdminList = function (request) {
    var sid = request.body.sid || request.query.sid;
    return function (data) {
        if (!sid) {
            return Promise.reject(401);
        }

        var command = MySQL.sugar()
            .select('*')
            .from('USER_SHOP_MAP')
            .where(`sid=${sid}`)
            .where(`uid=${data.user.uid}`)
            .toString();

        var finish = function (list) {
            data.admins = list.map((item) => {
                return item.uid;
            });
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(finish);
    };
};

exports.isAdmin = isAdmin;
exports.queryItem = queryItem;
exports.queryAdminList = queryAdminList;

//----------
// 查询列表
//----------

var pageNum = 10;

/**
 * 根据页码查询商店列表
 * @param {*} request 
 */
var queryUserShopSidList = function (request) {
    return function (data) {
        var command = MySQL.sugar()
            .select('sid')
            .from('USER_SHOP_MAP')
            .where(`uid=${data.user.uid}`)
            .toString();

        var finish = function (list) {
            data.sids = list.map((item) => {
                return item.sid;
            });
            return Promise.resolve(data);
        };
        
        return MySQL.execute(command).then(finish);
    };
};

/**
 * 传入一个 sids 列表，查询每个商店的具体信息
 * @param {*} request 
 */
var queryShopFromSids = function (request) {
    return function (data) {
        var tasks = data.sids.map((sid) => {
            var command = MySQL.sugar()
                .select('*')
                .from('SHOP')
                .where(`sid=${sid}`)
                .toString();

            return MySQL.execute(command);
        });

        var finish = function (list) {
            data.shops = list.map((item) => {
                return item[0];
            });
            return Promise.resolve(data);
        };

        return Promise.all(tasks).then(finish);
    };
};

exports.queryUserShopSidList = queryUserShopSidList;
exports.queryShopFromSids = queryShopFromSids;

//----------
// 查询列表
//----------

/**
 * 插入管理员
 * @param {*} request 
 */
var insertAdmin = function (request) {
    var uid = request.body.uid || request.query.uid;
    var sid = request.body.sid || request.query.sid;
    return function (data) {
        var command = MySQL.sugar()
            .insert('USER_SHOP_MAP')
            .add('sid', sid)
            .add('uid', uid)
            .add('create_time', Math.floor((new Date() - 0) / 1000))
            .toString();

        var finish = function () {
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(finish);
    };
};

exports.insertAdmin = insertAdmin;