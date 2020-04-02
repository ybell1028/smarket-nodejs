var express = require('express');
var util = require('../middleware/util');
const usersController = require('../controllers/usersController');
var router = express.Router();

//1. post로 요청할 URL) http://localhost:3000/api/users
//2. 회원가입 하는것이기 때문에 헤더에 토큰 넣을 필요 없음
//3. body에 입력해야하는 JSON 포맷
//1)userid(이번에 변경됨) 2)password 3)name
router.post('/', usersController.userRegister);

//1. post로 요청할 URL) http://localhost:3000/api/users/passwordconfirm
//2. util.isLoggedin(로그인 되어있는지 확인하는 미들웨어) -> 헤더에 토큰 넣어야함
//3. body에 입력해야하는 JSON 포맷
//1)password 
router.post('/passwordconfirm', util.isLoggedin, usersController.userPasswordConfirm);
router.get('/', util.isAdmin, usersController.userList);

//1. get으로 요청할 URL) http://localhost:3000/api/users/tpgus123(사용자 id)
//2. util.isLoggedin(로그인 되어있는지 확인하는 미들웨어) -> 헤더에 토큰 넣어야함
//3. POST, PUT, PATCH외의 HTTP 메소드는 body가 필요없음(JSON 안넣어도 됨)
router.get('/:userid', util.isLoggedin, util.checkPermission, usersController.userDetail);
router.put('/:userid', util.isLoggedin, util.checkPermission, usersController.userModify);
router.delete('/', usersController.userWithdraw);

module.exports = router;

