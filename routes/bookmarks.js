var express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
var util = require('../middleware/util');
var router = express.Router();

//1. post로 요청할 URL) http://localhost:3000/api/bookmark
//2. 헤더에 토큰 넣어줘야함(util.isLoggedin)
//3. body에 입력해야하는 JSON 포맷
//1)listname 2)bookmarkname 3)url
router.post('/', util.isLoggedin, bookmarkController.bookmarkCreate);
router.get('/', util.isLoggedin, bookmarkController.bookmarkList);
router.get('/:bookmarkid', util.isLoggedin, bookmarkController.bookmarkDetail);
router.put('/', util.isLoggedin, bookmarkController.bookmarkFolderModify);
router.put('/:bookmarkid', util.isLoggedin, bookmarkController.bookmarkModify);
router.delete('/', util.isLoggedin, bookmarkController.bookmarkFolderDelete);
router.delete('/:bookmarkid', util.isLoggedin, bookmarkController.bookmarkDelete);

module.exports = router;