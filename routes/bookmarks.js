var express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
var util = require('../middleware/util');
var validation = require("../middleware/validation");
var router = express.Router();

// POST api/bookmarks - 북마크 등록
router.post('/', 
    util.isLoggedin,
    validation.folder_name,
    validation.bookmark_name,
    validation.url,
    validation.result,
    bookmarkController.bookmarkCreate);


// GET api/bookmarks - 북마크 전체 조회   
router.get('/', 
    util.isLoggedin,
    validation.result,
    bookmarkController.bookmarkList);

// GET api/bookmarks/bookmarkid - 해당 id의 북마크 조회
// api/bookmarks/bookmarkid?foldername=폴더이름 - 해당 폴더에 있는 북마크 조회   
router.get('/:bookmarkid', 
    util.isLoggedin,
    validation.result,
    bookmarkController.bookmarkDetail);

// PUT api/bookmarks - 북마크 폴더 이름 변경   
router.put('/', 
    util.isLoggedin,
    validation.before_name,
    validation.after_name,
    validation.result,
    bookmarkController.bookmarkFolderModify);

// PUT api/bookmarks/bookmarkid - 해당 id의 북마크 정보 변경(이름, 내용)   
router.put('/:bookmarkid', 
    util.isLoggedin,
    validation.folder_name,
    validation.bookmark_name,
    validation.url,
    validation.result,
    bookmarkController.bookmarkModify);

// DELETE api/bookmarks - 북마크 폴더 삭제   
router.delete('/', 
    util.isLoggedin,
    validation.result,
    bookmarkController.bookmarkFolderDelete);


// DELETE api/bookmarks/bookmarkid - 해당 id의 북마크 삭제
router.delete('/:bookmarkid', 
    util.isLoggedin,
    validation.result,
    bookmarkController.bookmarkDelete);

module.exports = router;