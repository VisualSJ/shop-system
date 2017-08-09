'use strict';

const Express = require('express');
const BodyParser  = require('body-parser');
const CookieParser  = require('cookie-parser');

const App = Express();

App.use(Express.static('./static'));
App.use(BodyParser.urlencoded({ extended: false }));
App.use(CookieParser());

App.set('view engine', 'jade');
App.set('views', './pages');

// USER
const User = require('./controller/user');

App.get('/user', User.index);
App.post('/user', User.index);
App.get('/user/register', User.register);
App.post('/user/register', User.register);

// ADDRESS
const Address = require('./controller/address');

App.get('/address', Address.index);
App.post('/address', Address.index);
App.get('/address/item', Address.item);
App.post('/address/item', Address.item);

// HOME
const Controller = require('./controller');

App.get('/', Controller.home);
App.post('/', Controller.home);

App.get('*', Controller.missing);
App.post('*', Controller.missing);

module.exports = App;