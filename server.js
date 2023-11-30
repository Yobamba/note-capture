// const app = require("./app");
const express = require("express");

const app = express();

app.use("/", require("./routes"));

const server = app.listen(10000, () => {
  console.log("Server is running on port 10000");
});

module.exports = server;