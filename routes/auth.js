var express = require('express');
var util = require('../middleware/util');
const authController = require('../controllers/authController');
var router = express.Router();

router.post('/login', authController.login);
// router.get('/logout', util.isLoggedin, authController.logout);
router.get('/me', util.isLoggedin, authController.me);
router.get('/refresh', util.isLoggedin, authController.refresh);

module.exports = router;