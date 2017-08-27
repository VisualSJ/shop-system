'use strict';

const User = require('../../utils/user');
const Message = require('../../utils/message');

/**
 * 检查用户是否登录
 * @param {*} request  
 */
var isLoggedIn = function (request) {
    var session = request.cookies.ss_session;
    return function (data) {
        var isLoggedIn = User.isLoggedIn(session);
        if (!isLoggedIn) {
            return Promise.reject(102);
        }

        var dataToUid = function (user) {
            data.user = user;
            return Promise.resolve(data);
        };

        return User.getUser(session).then(dataToUid);
    };
};

var exists = function () {
    
};

exports.isLoggedIn = isLoggedIn;