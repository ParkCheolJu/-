let express = require('express');
let router = express.Router();
let mailController = require('../controllers/mailController');

router.post('/sendMail', mailController.sendMail);

module.exports = router;