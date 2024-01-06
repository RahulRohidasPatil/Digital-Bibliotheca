var app = require("express").Router();
var adminObject = require("./admin");


app.get("/unapproved-media", adminObject.getUnapprovedMedia);
app.put("/verify-media",adminObject.approveMedia);
module.exports = app;