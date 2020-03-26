var express = require('express');
var util = require('../middleware/util');
const usersController = require('../controllers/usersController');
var router = express.Router();

router.post('/', usersController.userRegister);
router.post('/passwordconfirm', util.isLoggedin, usersController.userPasswordConfirm);
router.get('/', util.isLoggedin, usersController.userList);
router.get('/:userid', util.isLoggedin, util.checkPermission, usersController.userInformation);
router.put('/:userid', util.isLoggedin, util.checkPermission, usersController.userModify);
router.delete('/', usersController.userWithdraw);

module.exports = router;

