'use strict';

const define = require('./define');
const database = require('../database');
const mysql = require('../database/mysql');

var createTable = function (name) {
    var command = define[name];
    return function () {
        return new Promise((resolve, reject) => {
            console.log(`开始创建 ${name} 表`);
            mysql.execute(`SHOW TABLES LIKE '${name}';`)
                .then((results) => {
                    if (results.length <= 0) {
                        mysql.execute(command.toString())
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
    console.log('连接数据库');
    database.start()
        .then(() => {
            console.log('连接成功');
        })
        .then(createTable('USER'))
        .then(createTable('SHOP'))
        .then(createTable('WAREHOUSE'))
        .then(createTable('MERCHANDISE'))
        .then(createTable('CUSTOMER'))
        .then(createTable('ORDER'))
        .then(() => {
            console.log('构建项目数据库成功');
            process.exit(0);
        }).catch((error) => {
            console.log('构建项目数据库失败');
            console.error(error);
            process.exit(0);
        });
};