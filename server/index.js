'use strict';

const express = require('./express');

const interface = require('./interface');
const controller = require('./controller');

// 加载控制器
express.use('/interface', interface);
express.use('/', controller);

module.exports = express;