var app = require("express").Router();
var mediaObject = require("./media");

app.get("/isowner", mediaObject.isOwner);
app.get("/purchased", mediaObject.purchased);
app.post("/search", mediaObject.search);
app.get("/", mediaObject.getAllMedia);
app.get("/:id", mediaObject.getByID);
app.post("/add", mediaObject.addMedia);
app.put("/update/:id", mediaObject.updateMedia);
app.delete("/delete/:id", mediaObject.deleteMedia);
app.patch("/reactivate/:id", mediaObject.reactivateMedia);
app.get("/getuploadedmedia/:ownerId", mediaObject.getByUserId);
app.post("/reportmedia", mediaObject.reportMedia);
app.post("/addComment", mediaObject.addComment)
app.post("/generateTags", mediaObject.generateTags)

module.exports = app;
