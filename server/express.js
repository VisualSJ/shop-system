'use strict';

const path = require('path');
const express = require('express');
const body  = require('body-parser');
const cookie  = require('cookie-parser');
const session = require('express-session');

const app = Express();

app.use(express.static('./static'));
app.use(body.urlencoded({ extended: false }));
app.use(cookie('hs_session'));
app.use(session({
    secret: 'hs_session',
    resave: true,
    saveUninitialized: true,
}));

// App.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'jade');

module.exports = app;