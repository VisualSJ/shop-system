'use strict';

const Database = require('../database');
const MySQL = Database.MySQL;

exports.waitDatabaseServer = function () {
    console.log('连接数据库');
    return new Promise((resolve, reject) => {
        if (MySQL.isConnect) {
            return resolve();
        }
        MySQL.once('connect', (error) => {
            if (error) {
                return rejcet(error);
            }
            resolve();
        });
    });
};

exports.createUserTable = function () {
    return new Promise((resolve, reject) => {
        console.log('创建 USER 表');
        var command = MySQL.sugar()
            .create('USER')
            // 唯一 ID
            .add('uid', 'INT(11)', 'NOT NULL PRIMARY KEY')
            // 用户名
            .add('name', 'VARCHAR(20)', 'NOT NULL')
            // 加密后的密码
            .add('password', 'VARCHAR(20)', 'NOT NULL')
            // 电子邮件
            .add('email', 'VARCHAR(100)')
            // 移动电话
            .add('phone', 'INT(11)')
            // 性别
            .add('sex', 'VARCHAR(10)')
            // 登录后的 session
            .add('session', 'VARCHAR(32)')
            // 登录的 IP 地址
            .add('session_ip', 'VARCHAR(15)')
            // 登录 session 的过期时间戳
            .add('session_expire', 'INT(13)')
            // 创建的时间
            .add('create_time', 'INT(13)');

        MySQL.execute(`SHOW TABLES LIKE '%USER%';`)
            .then((results) => {
                if (results.length <= 0) {
                    console.log(123);
                    MySQL.execute(command.toString())
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                } else {
                    console.log('USER 表已经存在');
                    resolve();
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.createAddressTable = function () {
    return new Promise((resolve, reject) => {
        console.log('创建 ADDRESS 表');
        var command = MySQL.sugar()
            .create('ADDRESS')
            // 唯一 id
            .add('aid', 'INT(11)', 'NOT NULL PRIMARY KEY')
            // 属于哪个用户
            .add('uid', 'INT(11)')
            // 国家
            .add('country', 'VARCHAR(100)')
            // 省份
            .add('province', 'VARCHAR(100)')
            // 城市
            .add('city', 'VARCHAR(100)')
            // 县区
            .add('county', 'VARCHAR(100)')
            // 街道
            .add('street', 'VARCHAR(100)')
            // 详细地址
            .add('other', 'VARCHAR(100)')
            // 创建的时间
            .add('create_time', 'INT(13)')

        MySQL.execute(`SHOW TABLES LIKE 'ADDRESS';`)
            .then((results) => {
                if (results.length <= 0) {
                    MySQL.execute(command.toString())
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                } else {
                    console.log('ADDRESS 表已经存在');
                    resolve();
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};