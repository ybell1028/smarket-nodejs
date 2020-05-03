var express = require('express');
var authRouter = require("./auth");
var usersRouter = require("./users");
var bookmarkRouter = require("./bookmarks");
var pushRouter = require("./push")
var naverRouter = require("./naver");
var youtubeRouter = require("./youtube");
var crawlingRouter = require("./crawling");

var app = express();

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/bookmarks", bookmarkRouter);
app.use("/push", pushRouter);
app.use("/naver", naverRouter);
app.use("/youtube", youtubeRouter);
app.use("/crawling", crawlingRouter);
 
module.exports = app;