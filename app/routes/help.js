let express = require('express');
let router = express.Router();
let helpController = require('../controllers/helpController');

router.get('/list', helpController.list);

module.exports = router;