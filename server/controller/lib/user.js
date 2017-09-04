'user strict';

const express = require('express');
const router = express();

router.all('/', (request, response) => {
    response.render('user');
});

router.all('/login', (request, response) => {
    response.render('user-login');
});

module.exports = router;