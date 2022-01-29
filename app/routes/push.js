let express = require('express');
let router = express.Router();
let indexController = require('../controllers/pushController');

router.post('/postin', indexController.testPostAPI);
router.post('/postOff', indexController.testPutAPI);

module.exports = router;
