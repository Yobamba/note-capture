const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;

const app = express();

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
