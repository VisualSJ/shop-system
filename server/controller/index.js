'use strict';

const express = require('express');
const router = express();

const user = require('./lib/user');

router.use('/user', user);

module.exports = router;