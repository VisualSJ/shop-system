'use strict';

const Events = require('events');
const MySQL = require('mysql');

const Sugar = require('./sugar');
const EventManager = new Events.EventEmitter();

var Connection = null;

exports.on = function (...args) {
    EventManager.on(...args);
};

exports.once = function (...args) {
    EventManager.once(...args);
};

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
                EventManager.emit('connect', error);
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
            if (error) {
                reject(error);
            }
            resolve(results, fields);
        });
    });
};

/**
 * 查询语法糖
 */
exports.sugar = Sugar;