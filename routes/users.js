var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/', userController.userList);
router.get('/user_add', userController.userAddGet);
router.post('/user_add', userController.userAddPost);

module.exports = router;