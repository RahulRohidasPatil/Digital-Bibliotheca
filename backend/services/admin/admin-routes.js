var app = require("express").Router();
var adminObject = require("./admin");

app.get("/users", adminObject.getUsers);
app.post("/banuser/:id", adminObject.banUser);
app.post("/unbanuser/:id", adminObject.unbanUser);

module.exports = app;