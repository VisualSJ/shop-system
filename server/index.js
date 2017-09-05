'use strict';

const path = require('path');
const express = require('express');
const body  = require('body-parser');
const cookie  = require('cookie-parser');
const session = require('express-session');

const app = express();

app.use(express.static('./static'));
app.use(body.urlencoded({ extended: false }));
app.use(cookie('hs_session'));
app.use(session({
    secret: 'hs_session',
    resave: true,
    saveUninitialized: true,
}));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

// 加载控制器
app.use('/', require('./controller'));

app.all('*', (request, response) => {
    response.end('404');
});

module.exports = app;