const routes = require('express').Router();

routes.get('/', (req, res) => {
  res.send('Hello');
});
routes.use('/notes', require('./notes'))

module.exports = routes;