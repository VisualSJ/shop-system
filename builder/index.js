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
            .add('uid', 'INT(9)', 'NOT NULL PRIMARY KEY')
            // 用户名
            .add('name', 'VARCHAR(32)', 'NOT NULL')
            // 加密后的密码
            .add('password', 'VARCHAR(32)', 'NOT NULL')
            // 电子邮件
            .add('email', 'VARCHAR(100)')
            // 移动电话
            .add('phone', 'INT(11)')
            // 性别
            .add('sex', 'INT(1)', 'DEFAULT 0')
            // 创建的时间
            .add('create_time', 'INT(11)');

        MySQL.execute(`SHOW TABLES LIKE 'USER';`)
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
                    console.log('USER 表已经存在');
                    resolve();
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.createShopTable = function () {
    return new Promise((resolve, reject) => {
        console.log('创建 SHOP 表');
        var command = MySQL.sugar()
            .create('SHOP')
            // 唯一 id
            .add('sid', 'INT(9)', 'NOT NULL PRIMARY KEY')
            // 哪个用户创建的
            .add('uid', 'INT(9)')
            // 创建的时间
            .add('create_time', 'INT(11)')

        MySQL.execute(`SHOW TABLES LIKE 'SHOP';`)
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
                    console.log('SHOP 表已经存在');
                    resolve();
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

exports.createUserShopMapTable = function () {
    return new Promise((resolve, reject) => {
        console.log('创建 SHOPMAP 表');
        var command = MySQL.sugar()
            .create('SHOPMAP')
            // 商店 sid
            .add('sid', 'INT(9)', 'NOT NULL PRIMARY KEY')
            // 用户 uid
            .add('uid', 'INT(9)')
            // 创建的时间
            .add('create_time', 'INT(11)')

        MySQL.execute(`SHOW TABLES LIKE 'SHOPMAP';`)
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
                    console.log('SHOPMAP 表已经存在');
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
            .add('aid', 'INT(9)', 'NOT NULL PRIMARY KEY')
            // 哪个用户创建的
            .add('uid', 'INT(9)')
            // 属于哪个商店
            .add('sid', 'INT(9)')
            // 地址的拥有者姓名
            .add('name', 'VARCHAR(20)')
            // 地址拥有者的性别
            .add('sex', 'INT(1)', 'DEFAULT 0')
            // 地址拥有者的电话
            .add('phone', 'VARCHAR(20)')
            // 地址拥有者的邮箱
            .add('email', 'VARCHAR(200)')
            // 省份
            .add('province', 'VARCHAR(100)')
            // 城市
            .add('city', 'VARCHAR(100)')
            // 县区
            .add('county', 'VARCHAR(100)')
            // 详细地址
            .add('other', 'VARCHAR(100)')
            // 创建的时间
            .add('create_time', 'INT(11)')

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