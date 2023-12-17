var app = require("express").Router();
var mediaObject = require("./media");

app.post("/search", mediaObject.search);
app.get("/", mediaObject.getAllMedia);
app.get("/:id", mediaObject.getByID);
app.post("/add", mediaObject.addMedia);
app.put("/update/:id", mediaObject.updateMedia);
app.put("/delete/:id", mediaObject.deleteMedia);
app.get("/getuploadedmedia/:ownerId", mediaObject.getByUserId);

module.exports = app;
