var express = require('express');
var util = require('../middleware/util');
var validation = require("../middleware/validation");
const usersController = require('../controllers/usersController');
var router = express.Router();

//POST시 필요한 json data는 validation.[data]입니다.
//ex) validation.user_id -> "user_id"

// POST api/users - 회원가입
router.post('/',
    validation.user_id,
    validation.password,
    validation.name,
    validation.nickname,
    validation.phonenum,
    validation.result,
    usersController.userRegister);

// POST api/users/passwordconfirm - 개인정보 수정시 비밀번호 확인
router.post('/passwordconfirm', 
    util.isLoggedin,
    validation.password,
    validation.result,
    usersController.userPasswordConfirm);

// GET api/users - 유저 전체 정보 조회, 다만 관리자 계정만 가능   
router.get('/', 
    util.isAdmin,
    validation.result,
    usersController.userList);

// GET api/users/userid - 해당 id의 유저 정보 조회, 호출 전에 먼저 passwordconfirm 해야함.
router.get('/:userid', 
    util.isLoggedin, 
    util.checkPermission,
    validation.result, 
    usersController.userDetail);

// PUT api/users/userid - 해당 id의 유저 정보 수정, 호출 전에 먼저 passwordconfirm 해야함.
router.put('/:userid', 
    util.isLoggedin, 
    util.checkPermission,
    validation.password,
    validation.name,
    validation.nickname,
    validation.phonenum,
    validation.result,
    usersController.userModify);

// DELETE api/users - 해당 유저 탈퇴, 호출 전에 먼저 passwordconfirm 해야함.    
router.delete('/', 
    util.isLoggedin, 
    util.checkPermission,
    validation.result,
    usersController.userWithdraw);

module.exports = router;