'use strict';

const Express = require('express');
const Router = Express();

Router.get('/', (request, response) => {
    response.redirect('/user/login');
});

Router.get('*', (request, response) => {
    response.send('404')
});

module.exports = Router;