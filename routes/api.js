var express = require('express');
var authRouter = require("./auth");
var usersRouter = require("./users");
var bookmarkRouter = require("./bookmarks");
var fcmRouter = require("./fcm")
var naverRouter = require("./naver");
var youtubeRouter = require("./youtube");
var crawlingRouter = require("./crawling");
var itemRouter = require("./item");


var app = express();

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/fcm", fcmRouter);
app.use("/naver", naverRouter);
app.use("/youtube", youtubeRouter);
app.use("/crawling", crawlingRouter);
app.use("/item", itemRouter);
 
module.exports = app;