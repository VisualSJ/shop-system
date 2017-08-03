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

// exports.MySQL.execute(`
// CREATE TABLE person (
//   number INT(11),
//   name VARCHAR(255),
//   birthday DATE
// );
// `).then(() => {
//     console.log('create success');
// }).catch((error) => {
//     console.log('create failure');
//     console.log(error);
// });

// var s = exports.MySQL.sugar().select('user').from('user').where('aa=aa').where('bb=bb').toString()
var s = exports.MySQL.sugar().create('user').add('id INT(11)').toString();
console.log(s);