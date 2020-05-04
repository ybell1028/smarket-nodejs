var express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
var util = require('../middleware/util');
var validation = require("../middleware/validation");
var router = express.Router();

// POST api/bookmarks - 북마크 등록
router.post('/', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.folder_name,
    validation.item_id,
    validation.item_title,
    validation.item_type,
    validation.result,
    bookmarkController.bookmarkCreate);

// GET api/bookmarks - 자신의 모든 폴더안에 있는 북마크  조회
// GET api/bookmarks?foldername=폴더이름 - 해당 폴더의 북마크 전체 조회      
router.get('/', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.bookmarkList);

// GET api/bookmarks/bookmarkid - 해당 id의 북마크 조회
// router.get('/:bookmarkid', 
//     util.isLoggedin,
//     validation.result,
//     bookmarkController.bookmarkDetail);

// PATCH api/bookmarks?foldername=폴더이름 - 북마크 폴더 이름 변경   
router.patch('/', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.new_name, //새 이름
    validation.result,
    bookmarkController.bookmarkFolderModify);

// PUT api/bookmarks/bookmarkid - 해당 id의 북마크 정보 변경(이름, 내용)   
router.put('/:bookmarkid', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.folder_name,
    validation.item_id,
    validation.item_title,
    validation.item_type,
    bookmarkController.bookmarkModify);

// DELETE api/bookmarks?foldername=폴더이름 - 북마크 폴더 삭제   
router.delete('/', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.bookmarkFolderDelete);


// DELETE api/bookmarks/bookmarkid - 해당 id의 북마크 삭제
router.delete('/:bookmarkid', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.bookmarkDelete);

module.exports = router;