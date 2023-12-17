var app = require("express").Router();
var dashboardObject = require("./dashboard");

app.get(
  "/getLatestMediaByType/:mediaType",
  dashboardObject.getLatestMediaByType
);

module.exports = app;
