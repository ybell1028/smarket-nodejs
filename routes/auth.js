var express = require('express');
var util = require('../middleware/util');
const authController = require('../controllers/authController');
var router = express.Router();
//1. post로 요청할 URL) http://localhost:3000/api/auth/login
//2. 토큰을 만들기 위해 로그인하는거기 때문에 헤더에 토큰 넣을 필요 없음
//3. body에 입력해야하는 JSON 포맷
//1)userid(이번에 변경됨) 2)password
router.post('/login', authController.login);


// router.get('/logout', util.isLoggedin, authController.logout);


//1. get으로 요청할 URL) http://localhost:3000/api/auth/refresh
//2. POST, PUT, PATCH 외의 GET, DELETE 메소드는 body를 보낼 필요가 없습니다.(JSON 형식으로 안보내줘도 된다는거)
//3. 토큰 재발급 라우터
router.get('/refresh', util.isLoggedin, authController.refresh);

module.exports = router;