var app = require("express").Router();
var mediaObject = require("./media");

app.post("/search", mediaObject.search);
app.get("/", mediaObject.getAllMedia);

module.exports = app;
