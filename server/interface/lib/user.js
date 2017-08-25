'use strict';

const User = require('../../utils/user');
const Message = require('../../utils/message');

/**
 * 检查用户是否登录
 * @param {*} request 
 * @param {*} response 
 */
var isLoggedIn = function (request, response) {
    var session = request.cookies.ss_session;
    return function (data) {
        var isLoggedIn = User.isLoggedIn(session);
        return function () {
            if (isLoggedIn) {
                return Promise.reject(102);
            }

            var dataToUid = function (user) {
                data.user = user;
                return Promise.resolve(data);
            };

            return User.getUser(session).then(dataToUid);
        };
    };
};


exports.isLoggedIn = isLoggedIn;