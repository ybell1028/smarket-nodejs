var express = require('express');
const youtubeController = require('../controllers/youtubeController');
var router = express.Router();

// GET api/naver/search?query=검색어 - 해당 검색어로 네이버 API 검색
router.get('/search', youtubeController.search);

module.exports = router;