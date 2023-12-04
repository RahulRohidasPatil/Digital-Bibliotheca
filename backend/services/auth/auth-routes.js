var app = require("express").Router();
var authObject = require("./auth");

app.post("/login", authObject.login);

app.post("/register", authObject.register);

module.exports = app;
