'use strict';

const Crypto = require('crypto');

const Database = require('../../database');
const MySQL = Database.MySQL;

const Session = {
    // session: { uid expiration_time }
};

var existsUid = function (uid) {
    return new Promise((resolve, reject) => {
        var cammond = MySQL.sugar()
            .select('*')
            .from('USER')
            .where(`uid=${uid}`);

        MySQL.execute(cammond.toString())
            .then((list) => {
                resolve(list.length > 0);
            }).catch(reject);
    });
};

var existsName = function (name) {
    return new Promise((resolve, reject) => {
        var cammond = MySQL.sugar()
            .select('*')
            .from('USER')
            .where(`name='${name}'`);

        MySQL.execute(cammond.toString())
            .then((list) => {
                resolve(list.length > 0);
            }).catch(reject);
    });
};

var createUid = function (level) {
    level = level || 0;
    return new Promise((resolve, reject) => {
        function randomNum() {
            return Math.random() * 10 | 0;
        };
        var uid = '';
        while (uid.length < 8) {
            uid += randomNum();
        }
        existsUid(uid)
            .then((exists) => {
                if (exists) {
                    return createUid(level + 1);
                }
                resolve(uid);
            })
            .catch(reject);
    });
};

/**
 * 
 * 101 用户已存在
 */
exports.register = function (info) {
    // 加密密码
    var password = Crypto
        .createHash('md5')
        .update(info.password)
        .digest('hex');

    var insert = function (uid) {
        // 生成插入命令
        var cammond = MySQL.sugar()
            .insert('USER')
            .add('uid', uid)
            .add('name', `'${info.username}'`)
            .add('password', `'${password}'`)
            .add('create_time', (new Date() - 0) / 1000);

        // 插入数据库
        return MySQL.execute(cammond.toString());
    };

    return existsName(info.username)
        .then((exists) => {
            if (exists) {
                return Promise.reject(101);
            }
            return createUid()
                .then(insert);
        });
};

/**
 * 登录
 * 
 * @param {Object} info { username: '', password: '' }
 * 
 * error code
 *   100 服务器错误
 *   101 用户不存在
 *   102 密码错误
 */
exports.login = function (info) {
    // 加密密码
    var password = Crypto
        .createHash('md5')
        .update(info.password)
        .digest('hex');
    
    // 生成查询命令
    var cammond = MySQL.sugar()
        .select('*')
        .from('USER')
        .where(`name='${info.username}'`);

    return MySQL
        .execute(cammond.toString())
        .then((list) => {
            if (list.length === 0) {
                return Promise.reject(101);
            }
            var user = list[0];
            if (user.password !== password) {
                return Promise.reject(102);
            }

            // 随机生成 session
            var chars = new String('ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678');
            function random() {
                var index = Math.random() * 49 | 0;
                if (index >= 48) {
                    index = 48;
                }
                return chars[index];
            };
            var session;
            do {
                session = '';
                while (session.length < 32) {
                    session += random();
                }
            } while (Session[session]);
            Session[session] = {
                uid: user.uid,
                // 有效期 7 天
                expiration_time: new Date() - 0 + 86400000 * 7
            }

            return Promise.resolve(session);
        });
};

/**
 * 登出
 * error code
 *   100 服务器错误
 *   101 登录信息不存在
 */
exports.logout = function (session) {
    var item = Session[session];
    if (!item) {
        return Promise.reject(101);
    }
    delete Session[session];
    return Promise.resolve();
};

exports.isLoggedIn = function (session) {
    return !!Session[session];
};

/**
 * 100 服务器错误
 * 101 用户不存在
 */
exports.getUserInfo = function (session) {
    var cache = Session[session];
    if (!cache) {
        return Promise.reject(101);
    }

    // 生成查询命令
    var cammond = MySQL.sugar()
        .select('*')
        .from('USER')
        .where(`uid='${cache.uid}'`);

    return MySQL
        .execute(cammond.toString())
        .then((list) => {
            if (list.length === 0) {
                return Promise.reject(101);
            } else if (list.length > 1) {
                return Promise.reject(100);
            }

            return Promise.resolve(list[0]);
        });
};

exports.update = function () {

};