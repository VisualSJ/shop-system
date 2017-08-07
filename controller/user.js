'use strict';

const Database = require('../database');
const MySQL = Database.MySQL;

var existsUid = function (uid) {
    return new Promise((resolve, reject) => {
        var cammond = MySQL.sugar()
            .select('*')
            .from('USER')
            .where(`uid=${uid}`);

        MySQL.execute(cammond.toString())
            .then((list) => {
                resolve(list.length > 0);
            }).catch(reject);
    });
};

var createUid = function (level) {
    level = level || 0;
    return new Promise((resolve, reject) => {
        function randomNum() {
            return Math.random() * 10 | 0;
        };
        var uid = '';
        while (uid.length < 8) {
            uid += randomNum();
        }
        existsUid(uid)
            .then((exists) => {
                if (exists) {
                    return createUid(level + 1);
                }
                resolve(uid);
            })
            .catch(reject);
    });
};

exports.register = function (info) {
    var insert = function (uid) {
        var cammond = MySQL.sugar()
            .insert('USER')
            .add('uid', uid)
            .add('name', `'${info.username}'`)
            .add('password', `'${info.password}'`)
            .add('create_time', (new Date() - 0) / 1000);

        return MySQL.execute(cammond.toString());
    };

    return createUid()
        .then(insert);
};

exports.login = function () {

};

exports.logout = function () {

};

exports.update = function () {

};