const express = require('express');
const util = require('../middleware/util');
const validation = require("../middleware/validation");
const fcmController = require('../controllers/fcmController');
var router = express.Router();

router.post('/send', 
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    fcmController.sendMessage);

router.patch('/receive',
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    fcmController.receiveToken);

router.get('/select',
    util.isLoggedin,
    validation.user_id, // 토큰 안에 들어있음 - json 데이터 불필요
    validation.result,
    fcmController.selectToken);


module.exports = router;