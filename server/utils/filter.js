'user strict';

const User = require('./user');

exports.guest = function (request, response, next) {
    var cookies, session;
    cookies = request.cookies;
    if (!cookies) {
        return response.redirect('/');
    }
    session = request.cookies.ss_session;
    if (!session) {
        return response.redirect('/');
    }

    var isLoggedIn = User.isLoggedIn(session);
    if (!isLoggedIn) {
        return response.redirect('/');
    }

    next();
};

exports.user = function (request, response, next) {
    var cookies, session;
    cookies = request.cookies;
    if (!cookies) {
        return next();
    }
    session = request.cookies.ss_session;
    if (!session) {
        return next();
    }

    var isLoggedIn = User.isLoggedIn(session);
    if (!isLoggedIn) {
        return next();
    }
    
    response.redirect('/user');
};