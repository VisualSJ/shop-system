'use strict';

exports.MySQL = require('./mysql');

exports.MySQL.connect({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'user'
}).then(() => {
    console.log('MySQL connect success!');
}).catch ((error) => {
    console.log('MySQL connect failure!');
    console.error(error);
});
