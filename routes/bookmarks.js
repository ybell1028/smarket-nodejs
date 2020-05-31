var express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
var util = require('../middleware/util');
var validation = require("../middleware/validation");
var router = express.Router();

// POST api/bookmarks - 북마크 등록
/*  
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!확인!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    POST, PATCH, PUT 일 때
    json 안에 넣을 것들
    user_id, (토큰 안에 이미 들어있음)
    item_selling (북마크 등록할때 디폴트값 true) 빼고
    validation. 붙어있는 전부
*/
router.post('/', 
    util.isLoggedin,
    validation.user_id,
    validation.folder_name,
    validation.item_alarm,
    validation.item_title,
    validation.item_link,
    validation.item_image,
    validation.item_lprice,
    validation.item_mallname,
    validation.item_id,
    validation.item_type,
    validation.result,
    bookmarkController.createBookmark);

// POST api/bookmarks/folder - 북마크 폴더 등록
router.post('/folder', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.folder_name,
    validation.result,
    bookmarkController.createFolder);

// GET api/bookmarks - 자신의 모든 폴더안에 있는 북마크  조회
// GET api/bookmarks?foldername=폴더이름 - 해당 폴더의 북마크 전체 조회      
router.get('/', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.bookmarkList);

// GET api/bookmarks/folder - 자신의 북마크 폴더 리스트 조회
router.get('/folder',
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.folderList);

// GET api/bookmarks/lprice - 알람 설정 된 북마크 최저가 정보 가져오기
router.get('/lprice',
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.updateLprice);

// GET api/bookmarks/lprice - 알람 설정 바꾸기 (item_alarm = T or F)
router.patch('/alarm',
    util.isLoggedin,
    validation.id,
    validation.user_id,
    validation.item_alarm,
    bookmarkController.updateAlarm);

// PATCH api/bookmarks?foldername=폴더이름 - 북마크 폴더 이름 변경   
router.patch('/', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.new_name, //새 이름
    validation.result,
    bookmarkController.updateFolderName);

// PUT api/bookmarks/bookmarkid - 해당 id의 북마크 정보 변경(이름, 내용)   
router.put('/:bookmarkid', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.folder_name,
    validation.item_alarm,
    validation.item_title,
    validation.item_link,
    validation.item_image,
    validation.item_lprice,
    validation.item_mallname,
    validation.item_id,
    validation.item_type,
    validation.result,
    bookmarkController.updateBookmark);

// DELETE api/bookmarks?foldername=폴더이름 - 북마크 폴더 삭제   
router.delete('/', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.deleteFolder);


// DELETE api/bookmarks/bookmarkid - 해당 id의 북마크 삭제
router.delete('/:bookmarkid', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    bookmarkController.deleteBookmark);

module.exports = router;





