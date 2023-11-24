const routes = require("express").Router();

routes.use("/notes", require("./notes"));
routes.use("/tags", require("./tags"));
routes.use("/trash", require("./trash"));
// routes.use("/start_page", require("./start_page"));

module.exports = routes;
