'use strict';

const Crypto = require('crypto');

const Database = require('../../../database');
const MySQL = Database.MySQL;
const Code = require('./code');

/**
 * cache {
 *   session: {
 *     uid
 *     expire_timestamp
 *   }
 * }
 */
const Cache = {};
const SESSION_STRING = new String('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
const EXPIRE_TIME = 86400 * 7; // 单位秒，时间戳 / 1000

/**
 * 创建一个新的 session
 * 这个 session 必须确保唯一性
 * 
 * @return {Stirng}
 */
var createSession = function () {
    var length = SESSION_STRING.length;
    var session;
    do {
        session = '';
        for (let i=0; i<32; i++) {
            session += SESSION_STRING[Math.random()*length|0];
        }
    } while (Cache[session]);

    return session;
};

/**
 * 用户登录
 * 
 * info {
 *   username
 *   password
 * }
 * 
 * @return {Promise}
 */
exports.login = function (info) {
    // 数据库没连接
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    if (!info.username) {
        return Promise.reject(210);
    }

    if (!info.password) {
        return Promise.reject(211);
    }

    var md5 = Crypto.createHash('md5').update(info.password).digest('hex');
    return MySQL.execute(`SELECT * FROM USER WHERE name='${info.username}'`)
        .then((list) => {
            if (!list || list.length > 1) {
                return Promise.reject(101);
            }
            var user = list[0];
            if (user.password !== md5) {
                return Promise.reject(211);
            }

            var session = createSession();
            Cache[session] = {
                uid: user.uid,
                expire_timestamp: ((new Date() - 0) / 1000 | 0) + EXPIRE_TIME,
            };
            return Promise.resolve(session);
        });
};

/**
 * 用户登出
 * 
 * @return {Promise}
 */
exports.logout = function (session) {
    var user = Cache[session];
    if (!user) Promise.reject(220);
    delete Cache[session];
    return Promise.resolve();
};

/**
 * 注册用户
 * 
 * info {
 *   username
 *   password
 *   sex
 *   email
 *   phone
 * }
 * 
 * @return {Promise}
 */
exports.register = function (info) {
    // 数据库没连接
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    var md5 = Crypto.createHash('md5').update(info.password).digest('hex');

    var command = MySQL.sugar()
        .insert('USER')
        .add('name', `'${info.username}'`)
        .add('password', `'${md5}'`)
        .add('sex', info.sex)
        .add('email', `'${info.email}'`)
        .add('phone', `'${info.phone}'`)
        .add('create_time', ((new Date() - 0) / 1000 | 0));

    return Promise.resolve()
        .then(() => {
            return MySQL.execute(`SELECT * FROM USER WHERE name='${info.username}'`)
                .then((list) => {
                    if (list.length > 0) {
                        return Promise.reject(201);
                    } else {
                        return Promise.resolve();
                    }
                });
        })
        .then(() => {
            return MySQL.execute(`SELECT * FROM USER WHERE email='${info.email}'`)
                .then((list) => {
                    if (list.length > 0) {
                        return Promise.reject(202);
                    } else {
                        return Promise.resolve();
                    }
                });
        })
        .then(() => {
            return MySQL.execute(`SELECT * FROM USER WHERE phone='${info.phone}'`)
                .then((list) => {
                    if (list.length > 0) {
                        return Promise.reject(203);
                    } else {
                        return Promise.resolve();
                    }
                });
        })
        .then(() => {
            return MySQL.execute(command.toString());
        });
};

exports.getUser = function (session) {
    var user = Cache[session];
    if (!user) {
        return Promise.resolve(null);
    }
    if (user.expire_timestamp - ((new Date() - 0) / 1000) < 0) {
        delete Cache[session];
        return Promise.resolve(null);
    }
    user.expire_timestamp = ((new Date() - 0) / 1000 | 0) + EXPIRE_TIME;
    return new Promise((resolve) => {
        var command = MySQL.sugar()
            .select('*')
            .from('USER')
            .where(`uid='${user.uid}'`);

        MySQL.execute(command.toString())
            .then((list) => {
                var user = list[0];
                return resolve(user);
            });
    });
};

/**
 * 检查用户登录状态
 * 同时会刷新登录保持的时间
 * 
 * @return {Boolean}
 */
exports.isLoggedIn = function (session) {
    var user = Cache[session];
    if (!user) {
        return false;
    }
    if (user.expire_timestamp - ((new Date() - 0) / 1000) < 0) {
        delete Cache[session];
        return false;
    }
    user.expire_timestamp = ((new Date() - 0) / 1000 | 0) + EXPIRE_TIME;
    return true;
};