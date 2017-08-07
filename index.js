'use strict';

const Express = require('express');
const bodyParser  = require('body-parser');
const Controller = require('./controller');

const App = Express();

App.set('view engine', 'jade');
App.set('views', './pages');

App.use(bodyParser());

App.get('/', Controller.home);
App.post('/', Controller.home);

App.get('*', Controller.missing);

module.exports = App;