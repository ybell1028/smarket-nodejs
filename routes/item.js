var express = require("express");
const itemController = require("../controllers/itemController");
var router = express.Router();

router.get("/detail", itemController.itemDetail);

module.exports = router;