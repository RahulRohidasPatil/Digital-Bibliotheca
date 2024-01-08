var app = require("express").Router();
var userObject = require("./user");

// app.post("/getUserDetails", userObject.getUserDetails);
// app.get("/", userObject.getAllMedia);
app.get("/getbyid/:id", userObject.getById);
app.patch("/edit-profile", userObject.editProfile)

module.exports = app;
