'use strict';

const Path = require('path');
const Express = require('express');
const BodyParser  = require('body-parser');
const CookieParser  = require('cookie-parser');

const App = Express();

App.use(Express.static('./static'));
App.use(BodyParser.urlencoded({ extended: false }));
App.use(CookieParser());

// App.set('views', Path.join(__dirname, '../views'));
App.set('view engine', 'jade');

module.exports = App;