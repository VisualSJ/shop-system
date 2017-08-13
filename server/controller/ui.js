'use strict';

const Express = require('express');
const Router = Express();

Router.get('/ui', (request, response) => {
    response.render('ui');
});

module.exports = Router;