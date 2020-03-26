var express = require('express');
var router = express.Router();

//추후 홈페이지 구현

router.get("/", function(req, res) {
	res.render("index", { title: "Express" });
});

module.exports = router;