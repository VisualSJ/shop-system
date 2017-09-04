'use strict';

const express = require('express');
const router = express();

const user = require('./lib/user');
const shop = require('./lib/shop');
const utils = require('./lib/utils');

router.use('/user', user);

module.exports = router;