'use strict';

const Crypto = require('crypto');

const Database = require('../../database');
const MySQL = Database.MySQL;
const Message = require('./message');

/**
 * cache {
 *   session: {
 *     uid
 *     expire_timestamp
 *   }
 * }
 */
const Cache = {
    k68Pw2asBt4CsfTXbOhHQTh0aUK62Keu: {
        uid: 1,
        expire_timestamp: new Date('2019/01/01')
    }
};
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
var login = function (info) {
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

    return Promise.resolve()
        // 查询用户
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('USER')
                .where(`name='${info.username}'`);
            return MySQL.execute(command.toString());
        })
        // 比对 user 密码是否正确
        .then((list) => {
            if (!list || list.length <= 0) {
                return Promise.reject(210);
            }
            var user = list[0];
            var md5 = Crypto.createHash('md5').update(info.password).digest('hex');
            if (user.password !== md5) {
                return Promise.reject(211);
            }
            return Promise.resolve(user);
        })
        // 正确的话，生成 session
        .then((user) => {
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
var logout = function (session) {
    var user = Cache[session];
    if (!user) {
        Promise.reject(220);
    }
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
var register = function (info) {
    // 数据库没连接
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    return Promise.resolve()
        // 查询用户名是否已经注册
        .then(() => {
            var command = MySQL.sugar().select('*')
                .from('USER')
                .where(`name='${info.username}'`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (list.length > 0) {
                return Promise.reject(201);
            } else {
                return Promise.resolve();
            }
        })
        // 查询邮箱是否已经注册
        .then(() => {
            var command = MySQL.sugar().select('*')
                .from('USER')
                .where(`email='${info.email}'`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (list.length > 0) {
                return Promise.reject(202);
            } else {
                return Promise.resolve();
            }
        })
        // 查询用户名，邮箱，电话是否已经注册
        .then(() => {
            var command = MySQL.sugar().select('*')
                .from('USER')
                .where(`phone='${info.phone}'`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (list.length > 0) {
                return Promise.reject(203);
            } else {
                return Promise.resolve();
            }
        })
        // 注册用户，插入用户表
        .then(() => {
            var md5 = Crypto.createHash('md5').update(info.password).digest('hex');
            var command = MySQL.sugar()
                .insert('USER')
                .add('name', `'${info.username}'`)
                .add('password', `'${md5}'`)
                .add('sex', info.sex)
                .add('email', `'${info.email}'`)
                .add('phone', `'${info.phone}'`)
                .add('portrait', `''`)
                .add('verify', 0)
                .add('level', 0)
                .add('create_time', ((new Date() - 0) / 1000 | 0));
            return MySQL.execute(command.toString());
        });
};

/**
 * 传入 session 返回 user 信息
 */
var getUser = function (session) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    var user = Cache[session];
    if (!user) {
        return Promise.reject(220);
    }
    if (user.expire_timestamp - ((new Date() - 0) / 1000) < 0) {
        delete Cache[session];
        return Promise.reject(220);
    }
    user.expire_timestamp = ((new Date() - 0) / 1000 | 0) + EXPIRE_TIME;
    return Promise.resolve()
        .then(() => {
            var command = MySQL.sugar()
                .select('*')
                .from('USER')
                .where(`uid='${user.uid}'`);
            return MySQL.execute(command.toString());
        })
        .then((list) => {
            if (!list || list.length <= 0) {
                return Promise.reject(221);
            }
            return Promise.resolve(list[0]);
        });
};

/**
 * 检查用户登录状态
 * 同时会刷新登录保持的时间
 * 
 * @return {Boolean}
 */
var isLoggedIn = function (session) {
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

exports.login = login;
exports.logout = logout;
exports.register = register;
exports.getUser = getUser;
exports.isLoggedIn = isLoggedIn;