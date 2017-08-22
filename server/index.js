'use strict';

const Express = require('./express');

// 载入控制器
const User = require('./controller/user');
const Shop = require('./controller/shop');
const Merchandise = require('./controller/merchandise');
const Ui = require('./controller/ui');
const Home = require('./controller/home');

const Interface = require('./interface');

// 加载控制器
Express.use('/user', User);
Express.use('/shop', Shop);
Express.use('/merchandise', Merchandise);
Express.use('/ui', Ui);

Express.use('/interface', Interface);

Express.use(Home);

module.exports = Express;