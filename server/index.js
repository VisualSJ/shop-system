'use strict';

const Express = require('./express');

// 载入控制器
const User = require('./controller/user');
const Shop = require('./controller/shop');
const Merchandise = require('./controller/merchandise');
const Ui = require('./controller/ui');
const Home = require('./controller/home');

// 加载控制器
Express.use(User);
Express.use(Shop);
Express.use(Merchandise);
Express.use(Ui);
Express.use(Home);

module.exports = Express;