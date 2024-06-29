const express = require("express");
const app = express();
const http = require("http");
const winston = require("winston");
require("./startup/validation")();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 1250;

const server = http.createServer(app);

server.listen(port, () => {
  winston.info(`EVENTS SERVER RUNNING ON PORT: ${ port }...`);
});

module.exports = server;
