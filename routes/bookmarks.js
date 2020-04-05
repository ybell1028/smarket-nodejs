var express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
var util = require('../middleware/util');
var validation = require("../middleware/validation");
var router = express.Router();

//1. post로 요청할 URL) http://localhost:3000/api/bookmark
//2. 헤더에 토큰 넣어줘야함(util.isLoggedin)
//3. body에 입력해야하는 JSON 포맷
//1)listname 2)bookmarkname 3)url
router.post('/', 
    util.isLoggedin,
    validation.user_id,
    validation.folder_name,
    validation.bookmark_name,
    validation.url,
    validation.result,
    bookmarkController.bookmarkCreate);
    
router.get('/', 
    util.isLoggedin,
    validation.user_id,
    validation.result,
    bookmarkController.bookmarkList);

router.get('/:bookmarkid', 
    util.isLoggedin,
    validation.user_id,
    validation.result,
    bookmarkController.bookmarkDetail);

router.put('/', 
    util.isLoggedin,
    validation.before,
    validation.after,
    validation.result,
    bookmarkController.bookmarkFolderModify);

router.put('/:bookmarkid', 
    util.isLoggedin,
    validation.user_id,
    validation.folder_name,
    validation.bookmark_name,
    validation.url,
    validation.result,
    bookmarkController.bookmarkModify);

router.delete('/', 
    util.isLoggedin,
    validation.user_id,
    validation.result,
    bookmarkController.bookmarkFolderDelete);
    
router.delete('/:bookmarkid', 
    util.isLoggedin,
    validation.user_id,
    validation.result,
    bookmarkController.bookmarkDelete);

module.exports = router;