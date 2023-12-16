var app = require("express").Router();
var messageObject = require("./message");

app.get("/getbychatid/:chatId", messageObject.getByChatId);
app.get("/getbysenderrecipient", messageObject.getBySenderRecipient)

module.exports = app;