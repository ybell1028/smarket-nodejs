var express = require('express');
var util = require('../middleware/util');
var validation = require("../middleware/validation");
const usersController = require('../controllers/usersController');
var router = express.Router();

router.post('/',
    validation.user_id,
    validation.password,
    validation.name,
    validation.nickname,
    validation.phonenum,
    validation.result,
    usersController.userRegister);

router.post('/passwordconfirm', 
    util.isLoggedin,
    validation.user_id,
    validation.password,
    validation.result,
    usersController.userPasswordConfirm);

router.get('/', 
    util.isAdmin,
    validation.user_id,
    validation.result,
    usersController.userList);

router.get('/:userid', 
    util.isLoggedin, 
    util.checkPermission,
    validation.result, 
    usersController.userDetail);

router.put('/:userid', 
    util.isLoggedin, 
    util.checkPermission,
    validation.result, 
    usersController.userModify);

router.delete('/', 
    util.isLoggedin, 
    util.checkPermission,
    validation.result,
    usersController.userWithdraw);

module.exports = router;