'use strict';

const Define = require('./define');
const Database = require('../database');
const MySQL = Database.MySQL;

var createTable = function (name) {
    var command = Define[name];
    return function () {
        return new Promise((resolve, reject) => {
            console.log(`开始创建 ${name} 表`);
            MySQL.execute(`SHOW TABLES LIKE '${name}';`)
                .then((results) => {
                    if (results.length <= 0) {
                        MySQL.execute(command.toString())
                            .then(resolve)
                            .catch(reject);
                    } else {
                        console.log(`${name} 表已经存在`);
                        resolve();
                    }
                })
                .catch(reject);
        });
    };
};

exports.start = function () {
    new Promise((resolve, reject) => {
        console.log('连接数据库');
        if (MySQL.isConnect) {
            return resolve();
        }
        MySQL.once('connect', (error) => {
            if (error) {
                return rejcet(error);
            }
            resolve();
        });
    })
    .then(createTable('USER'))
    .then(createTable('SHOP'))
    .then(createTable('USER_SHOP_MAP'))
    .then(createTable('WAREHOUSE'))
    .then(createTable('MERCHANDISE'))
    .then(createTable('CUSTOMER'))
    .then(createTable('CUSTOMER_ORDER'))
    .then(() => {
        console.log('构建项目数据库成功');
        process.exit(0);
    }).catch((error) => {
        console.log('构建项目数据库失败');
        console.error(error);
        process.exit(0);
    });
};