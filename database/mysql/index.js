'use strict';

const MySQL = require('mysql');

const Sugar = require('./sugar');

var Connection = null;

// 是否已经连接
exports.isConnect = false;

/**
 * 连接数据库
 */
exports.connect = function (options) {
    return new Promise((resolve, reject) => {
        try {
            Connection = MySQL.createConnection({
                host: options.host,
                user: options.user,
                password: options.password,
                database: options.database,
            });
            Connection.connect((error) => {
                if (error) {
                    return reject(error);
                }
                exports.isConnect = true;
                resolve();
            });
        } catch (error) {
            Connection = null;
            reject(error);
        };
    });
};

/**
 * 执行语句
 */
exports.execute = function (command) {
    return new Promise((resolve, reject) => {
        Connection.query(command, (error, results, fields) => {
            console.log(error);
            console.log(results);
            console.log(fields);
            if (error) {
                reject();
            }
            resolve();
        });
    });
};

/**
 * 查询语法糖
 */
exports.sugar = function () {
    return new Sugar();
};