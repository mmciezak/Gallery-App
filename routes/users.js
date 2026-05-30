var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.get('/', userController.userList);
router.get('/user_add', userController.userAddGet);
router.post('/user_add', userController.userAddPost);
router.get('/login',      userController.userLoginGet);
router.post('/login',     userController.userLoginPost);
router.get('/logout',     userController.userLogout);

module.exports = router;