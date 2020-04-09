var express = require('express');
var validation = require("../middleware/validation");
const authController = require('../controllers/authController');
var router = express.Router();
router.post('/login',
    validation.user_id,
    validation.password,
    validation.result,
    authController.login);

router.get('/refresh', authController.refresh);

router.post('/checkid', 
    validation.user_id,
    validation.result,
    authController.checkId);

router.post('/checknickname',
    validation.nickname,
    validation.result,
    authController.checkNickname);


module.exports = router;