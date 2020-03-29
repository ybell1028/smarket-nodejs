var express = require('express');
const pushController = require('../controllers/pushController');
var router = express.Router();

router.post('/send', pushController.sendPush);
router.post('/receive', pushController.receiveToken);

module.exports = router;