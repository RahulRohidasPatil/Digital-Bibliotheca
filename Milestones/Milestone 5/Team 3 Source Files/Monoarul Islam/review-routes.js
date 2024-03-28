var app = require('express').Router();
var reviewObject = require('./review');

app.get('/:mediaId', reviewObject.getReviews);
app.post('/:mediaId', reviewObject.createReview);

module.exports = app;
