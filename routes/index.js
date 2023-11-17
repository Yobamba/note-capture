const routes = require('express').Router();

routes.use('/notes', require('./notes'))
routes.use('/tags', require('./tags'))
routes.use('/trash', require('./trash'))

module.exports = routes;