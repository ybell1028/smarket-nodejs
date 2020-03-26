var express = require('express');
const youtubeController = require('../controllers/youtubeController');
var router = express.Router();

router.get('/search', youtubeController.search);

module.exports = router;