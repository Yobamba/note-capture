const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


const app = express();
app
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use(bodyParser.json())
  .use(cors({ origin: '*' }))
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        next();
    })
  .use('/', require('./routes'));


mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
