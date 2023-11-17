const routes = require('express').Router();

routes.use('/notes', require('./notes'))

module.exports = routes;