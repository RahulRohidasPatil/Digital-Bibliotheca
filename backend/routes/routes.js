var app = require("express").Router();
// var jwt = require("jsonwebtoken");
// var connection = require("../../utils/connection");

var mediaRoutes = require("../services/media/media-routes");

app.use("/media", middleware, mediaRoutes);

function middleware(req, res, next) {
  console.log("MiddleWare Working");
  next();
}

module.exports = app;
