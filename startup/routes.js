const cors = require("cors");
const root = require("../routes/home");
const signup = require("../routes/signup");
const error = require("../middleware/error");
const express = require("express");

module.exports = function (app) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.static("public"));
  app.use("/", root);
  app.use("/api/signup", signup);

  // Not found Route...
  app.use((req, res, next) => {
    res.status(404).send("<h1> This Page is  Not Found. </h1>");
  });

  // Logging error middleware in express...
  app.use(error);
};
