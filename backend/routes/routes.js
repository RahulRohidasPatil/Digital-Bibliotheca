var app = require("express").Router();
// var jwt = require("jsonwebtoken");
// var connection = require("../../utils/connection");

var mediaRoutes = require("../services/media/media-routes");
var authRoutes = require("../services/auth/auth-routes");

app.use("/media", middleware, mediaRoutes);
app.use("/auth", middleware, authRoutes);


function middleware(req, res, next) {
  console.log("MiddleWare Working");
  next();
}

module.exports = app;
