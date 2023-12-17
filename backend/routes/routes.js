var app = require("express").Router();
var jwt = require("jsonwebtoken");
var connection = require("../utils/connection");
const JWT_SECRET = process.env.JWT_SECRET;
require("dotenv").config();

var mediaRoutes = require("../services/media/media-routes");
var authRoutes = require("../services/auth/auth-routes");
var chatRoutes = require("../services/chat/chat-routes");
var messageRoutes = require("../services/message/message-routes");
var userRoutes = require("../services/user/user-routes");
var dashboardRoutes = require("../services/dashboard/dashboard-routes");

app.use("/media", middleware, mediaRoutes);
app.use("/dashboard", middleware, dashboardRoutes);
app.use("/auth", authRoutes);
app.use("/chat", middleware, chatRoutes);
app.use("/message",middleware, messageRoutes);
app.use("/user", middleware, userRoutes);

function middleware(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).send({ message: "Unauthorized: No Token Found" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      console.log(err);
      return res.status(403).send({ message: "Could not verify token" });
    }

    req.user = payload;
    let query = "Select Id from user WHERE EmailAddress = ?";
    let userResponse = await connection.query(query, [payload.EmailAddress]);
    if (userResponse && userResponse.length) {
      next();
    } else {
      return res
        .status(403)
        .send({ message: "Could not verify token Id signature invalid" });
    }
  });
}

module.exports = app;
