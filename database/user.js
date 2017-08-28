'user strict';

const mysql = require('./mysql');

var insert = function (info) {
    var command = mysql.sugar()
        .insert('User')
        .add('name', '')
        .add('password', '')
        .add('email', '')
        .add('phone', '')
        .add('portrait', '')
        .add('verify', '')
        .add('level', '')
        .add('sex', '')
        .add('create_time')
        .toString();

    return mysql.execute(command)
};

var remove = function () {

};

var exists = function () {

};

var update = function () {
    
};