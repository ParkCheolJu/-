let express = require('express');
let router = express.Router();
let noticeController = require('../controllers/noticeController');

router.get('/list', noticeController.list);

module.exports = router;