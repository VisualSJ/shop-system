'use strict';

var mysql = require('./mysql');

var connectMySQL = function () {
    return new Promise((resolve, reject) => {
        mysql.connect({
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'user'
        }).then(() => {
            resolve();
        }).catch ((error) => {
            reject(error);
        });
    });
};

exports.start = function () {
    return Promise.resolve()
        .then(connectMySQL);
};