var app = require("express").Router();
var adminObject = require("./admin");

app.get("/unapproved-media", adminObject.getUnapprovedMedia);
app.put("/verify-media", adminObject.approveMedia);
app.get("/users", adminObject.getUsers);
app.post("/banuser/:id", adminObject.banUser);
app.post("/unbanuser/:id", adminObject.unbanUser);
app.get("/reported-media", adminObject.getReportedMedia);
app.post("/review-reported-media", adminObject.reviewReportedMedia);

module.exports = app;
