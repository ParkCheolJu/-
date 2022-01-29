let express = require('express');
let router = express.Router();
let userController = require('../controllers/userController');

router.get('/list', userController.list);
router.get('/getId', userController.getId);
router.get('/login', userController.getLoginInfo);
router.get('/join', userController.joinIn);

module.exports = router;