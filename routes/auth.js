var express = require('express');
var validation = require("../middleware/validation");
const authController = require('../controllers/authController');
var router = express.Router();

//POST시 필요한 json data는 validation.[data]입니다.
//ex) validation.user_id -> "user_id"

// POST api/auth/login - 로그인
router.post('/login',
    validation.user_id,
    validation.password,
    validation.result,
    authController.login);

// GET api/auth/refresh - 토큰 재발급
router.get('/refresh', authController.refresh);

// POST api/auth/checkid - ID 중복 체크
router.post('/checkid', 
    validation.user_id,
    validation.result,
    authController.checkId);

// POST api/auth/checknickname - 닉네임 중복 체크
router.post('/checknickname',
    validation.nickname,
    validation.result,
    authController.checkNickname);


module.exports = router;