var app = require("express").Router();
var chatObject = require("./chat");

app.get("/getuserchats/:userId", chatObject.getUserChats);

module.exports = app;
