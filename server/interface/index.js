'use strict';

const Express = require('express');
const Router = Express();

const User = require('./lib/user');
const Shop = require('./lib/shop');
const Utils = require('./lib/utils');

module.exports = Router;