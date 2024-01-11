var app = require("express").Router();
var purchaseObject = require("./purchase");

app.get("/getmediapurchases/:userId", purchaseObject.getUserPurchases);
app.post("/", purchaseObject.create)

module.exports = app;