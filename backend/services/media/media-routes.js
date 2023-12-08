var app = require("express").Router();
var mediaObject = require("./media");

app.post("/search", mediaObject.search);
app.get("/", mediaObject.getAllMedia);
app.get("/:id", mediaObject.getMedia);

module.exports = app;
