var app = require("express").Router();
var adminObject = require("./admin");

app.get("/unapproved-media", adminObject.getUnapprovedMedia);
app.put("/verify-media",adminObject.approveMedia);
app.get("/users", adminObject.getUsers);
app.post("/banuser/:id", adminObject.banUser);
app.post("/unbanuser/:id", adminObject.unbanUser);

module.exports = app;