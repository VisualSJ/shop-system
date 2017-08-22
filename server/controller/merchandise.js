'use strict';

const Express = require('express');
const Router = Express();

const Database = require('../../database');
const MySQL = Database.MySQL;

const User = require('../utils/user');
const Filter = require('../utils/filter');

//////////////
// 声明过滤器 //
//////////////
Router.get('/', Filter.guest);

/////////////////
// 定义具体的接口 //
/////////////////
Router.get('/', (request, response) => {

    var responseData = {
        user: null,
    };
    
    // 过滤器内已经判断，所以这里必然存在这个属性
    var session = request.cookies.ss_session;

    User.getUser(session)
        .then((user) => {
            responseData.user = user;
        })
        .then(() => {
            response.render('merchandise', responseData);
        });
});

module.exports = Router;