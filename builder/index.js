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
    console.log('创建 USER 表');
    return new Promise((resolve, reject) => {
        var command = MySQL.sugar()
            .create('USER')
            .add('uid', 'INT(11)', 'NOT NULL PRIMARY KEY')
            .add('name', 'VARCHAR(20)', 'NOT NULL')
            .add('password', 'VARCHAR(20)', 'NOT NULL')
            .add('create_time', 'TIMESTAMP');

        MySQL.execute(`SHOW TABLES LIKE '%USER%';`)
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