var express = require('express');
const bookmarkController = require('../controllers/bookmarkController');
var util = require('../middleware/util');
var router = express.Router();

router.post('/', util.isLoggedin, bookmarkController.bookmarkCreate);
router.get('/', util.isLoggedin, bookmarkController.bookmarkList);
router.delete('/', util.isLoggedin, bookmarkController.bookmarkFolderDelete);
router.delete('/:bookmarkid', util.isLoggedin, bookmarkController.bookmarkDelete);

module.exports = router;