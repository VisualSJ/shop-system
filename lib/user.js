'use strict';

const mysql = require('../database/mysql');

var check = {

    /**
     * 检查用户名合法性
     * @param {*} name 
     */
    name (name) {
        if (
            typeof name !== 'string' ||
            name.length < 2 ||
            name.length > 10 ||
            !/^[a-zA-Z]+[a-zA-Z0-9_]*$/.test(name)
        ) {
            return false;
        }

        return true;
    },
    
    /**
     * 检查密码是否符合要求
     * @param {*} password 
     */
    password (password) {
        if (
            typeof password !== 'string' ||
            password.length < 6 ||
            password.length > 20
        ) {
            return false;
        }
        return true;
    },
    
    /**
     * 检查邮箱是否符合要求
     * @param {*} email 
     */
    email (email) {
        if (
            typeof email !== 'string'
        ) {
            return false;
        }
        return true;
    },
    
    /**
     * 检查手机号码是否符合要求
     * @param {*} phone 
     */
    phone (phone) {
        if (
            typeof phone !== 'number' ||
            phone.toString().length !== 11
        ) {
            return false;
        }
        return true;
    },
};

exports._check = check;

/**
 * 插入新用户
 * @param {Object} info - 用户信息 
 */
var insert = function (info) {
    var command = mysql.sugar().insert('USER')
        .add('name', info.name)
        .add('password', info.password)
        .add('email', info.email)
        .add('phone', info.phone)
        // .add('portrait', '')
        .add('level', 0)
        // .add('shops', '')
        .add('sex', info.sex)
        .add('create_time', Date.now() / 1000 | 0);

    if (
        !check.name(info.name) ||
        !check.password(info.password) ||
        !check.email(info.password) ||
        !check.phone(info.phone)
    ) {
        return Promise.reject(510);
    }

    return mysql.execute(command.toString());
};

/**
 * 判断用户是否存在
 * @param {*} info 
 */
var count = function (info) {
    var whereArr = Object.keys(info).map((key) => {
        return `${key}='${info[key]}'`;
    });
    var command = `SELECT COUNT(*) as count FROM USER ${whereArr.length > 0 ? 'WHERE' : ''} ${whereArr.join('OR')};`;
    return mysql.execute(command)
    .then((list) => {
        if (!list) {
            return Promise.reject(500);
        }
        return Promise.resolve(list[0].count);
    });
};

/**
 * 查询用户队列
 * @param {*} info 
 */
var query = function (info) {
    var command = mysql.sugar().select('*').from('USER');
    Object.keys(info).forEach((key) => {
        let value = typeof info.value === 'string' ? `'${info.value}'` : info.value;
        command.where(`${key}='${value}'`);
    });
    return mysql.execute(command.toString())
    .then((list) => {
        return Promise.resolve(list[0]);
    });
};

/**
 * 更改用户数据
 * @param {*} info 
 */
var update = function (info) {
    var command = mysql.sugar().update('USER');
    Object.keys(info).forEach((key) => {
        command.set(key, info[key]);
    });

};

exports.insert = insert;
exports.count = count;
exports.query = query;