const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.send('Hello');
});
routes.use('/notes', require('./notes'))
routes.use('/tags', require('./tags'))
routes.use('/trash', require('./trash'))

module.exports = routes;