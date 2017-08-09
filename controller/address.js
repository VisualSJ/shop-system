'use strict';

const User = require('./lib/user');

exports.index = function (request, response) {
    var session = request.cookies['ss_session'];
    if (!User.isLoggedIn(session)) {
        response.redirect('/');
        return;
    }

    User.getUserInfo(session)
        .then((info) => {
            response.render('address', {
                user: info,
            });
        })
        .catch((error) => {
            console.log(error);
            response.redirect('/');
        });
};

exports.item = function (request, response) {
    var session = request.cookies['ss_session'];
    if (!User.isLoggedIn(session)) {
        response.redirect('/');
        return;
    }

    var aid = request.query.aid;

    var name = request.body.name;
    var sex = request.body.sex;
    var phone = request.body.phone;
    var email = request.body.email;
    var province = request.body.province;
    var city = request.body.city;
    var county = request.body.county;
    var other = request.body.other;
    // var create_time = (new Date() - 0) / 1000;

    console.log(name);

    if (aid) { // 更新

    } else {

    }

    User.getUserInfo(session)
        .then((info) => {
            response.render('address-item', {
                user: info,
                data: {

                }
            });
        })
        .catch((error) => {
            console.log(error);
            response.redirect('/');
        });
};