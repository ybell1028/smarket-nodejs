var express = require('express');
const naverController = require('../controllers/naverController');
var router = express.Router();

router.get('/search', naverController.search);

module.exports = router;