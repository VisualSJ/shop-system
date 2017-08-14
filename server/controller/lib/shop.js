'use strict';

const Database = require('../../../database');
const MySQL = Database.MySQL;

exports.getShop = function (sid) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }
    return new Promise((resolve, reject) => {
        var command = MySQL.sugar()
            .select('*')
            .from('SHOP')
            .where(`sid=${sid}`);

        MySQL.execute(command.toString())
            .then((list) => {
                if (!list || list.length <= 0) {
                    reject(310);
                }
                resolve(list[0]);
            });
    });
};

exports.register = function (info) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    var checkName = function (name) {
        var command = MySQL.sugar()
            .select('*')
            .from('SHOP')
            .where(`name='${name}'`)
        return new Promise((resolve, reject) => {
            MySQL.execute(command.toString())
                .then((list) => {
                    if (!list || list.length <= 0) {
                        resolve();
                    }
                    reject(301);
                });
        });
    };

    var register = function () {
        if (!info.name || info.name.length < 2) {
            return Promise.reject(302);
        }
        if (!info.uid) {
            return Promise.reject(303);
        }
        var command = MySQL.sugar()
            .insert('SHOP')
            .add('name', `'${info.name}'`)
            .add('uid', `uid='${info.uid}'`)
            .add('create_time', (new Date() - 0) / 1000);
        return MySQL.execute(command.toString());
    };

    return checkName(info.name).then(register);
};

exports.update = function (info) {
    if (!MySQL.isConnect) {
        return Promise.reject(101);
    }

    var checkName = function (name) {
        var command = MySQL.sugar()
            .select('*')
            .from('SHOP')
            .where(`name='${name}'`)
        return new Promise((resolve, reject) => {
            MySQL.execute(command.toString())
                .then((list) => {
                    if (!list || list.length <= 0) {
                        resolve();
                    }
                    reject(301);
                });
        });
    };

    var update = function () {
        if (!info.name || info.name.length < 2) {
            return Promise.reject(302);
        }
        if (!info.sid) {
            return Promise.reject(310);
        }
        var command = MySQL.sugar()
            .update('SHOP')
            .set('name', `'${info.name}'`)
            .where(`sid=${info.sid}`);
        return MySQL.execute(command.toString());
    };

    return checkName(info.name).then(update);
};