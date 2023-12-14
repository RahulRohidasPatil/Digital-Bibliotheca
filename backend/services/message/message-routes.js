var app = require("express").Router();
var messageObject = require("./message");

app.get("/getbychatid/:chatId", messageObject.getByChatId);

module.exports = app;