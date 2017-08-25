'use strict';

const Database = require('../../../database');
const MySQL = Database.MySQL;

/**
 * 用户创建的商店上限
 * @param {*} request 
 * @param {*} response 
 */
var userLimit = function (request, response) {
    return function (data) {
        if (!data.user) {
            return Promise.reject(102);
        }

        var command = MySQL.sugar()
            .select('*')
            .from('SHOP')
            .where(`uid='${data.user.uid}'`)
            .toString();

        var checkLength = function (list) {
            if (list.length >= 2) {
                return Promise.reject(304);
            }
            return Promise.resolve(data);
        };

        return MySQL.execute(command).then(checkLength);
    };
};

/**
 * 是否重名
 * @param {*} request 
 * @param {*} response 
 */
var duplicationName = function (request, response) {
    var name = request.body.name || request.query.name;
    return function (data) {
        if (!data.user) {
            return Promise.reject(102);
        }

        var check = function (list) {
            if (list && list.length > 0) {
                return Promise.reject(301);
            }
            return Promise.resolve(data);
        };

        var command = MySQL.sugar()
            .select('sid')
            .from('SHOP')
            .where('name', `'${name}'`)
            .toString();

        return MySQL.execute(command).then(check);
    };
};

/**
 * 插入新商店
 * @param {*} request 
 * @param {*} response 
 */
var insert = function (request, response) {
    var name = request.body.name || request.query.name;
    return function (data) {
        if (!data.user) {
            return Promise.reject(102);
        }
    
        if (!name || !/\S{2, 6}/.test(name)) {
            return Promise.reject(302);
        }

        var command = MySQL.sugar()
            .insert('SHOP')
            .add('name', `'${name}'`)
            .add('uid', data.user.uid)
            .toString();

        return MySQL.execute(command).then(checkLength);
    };
};

exports.userLimit = userLimit;
exports.duplicationName = duplicationName;
exports.insert = insert;