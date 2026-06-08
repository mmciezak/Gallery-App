var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

// router.get('/', userController.userList);
// router.get('/user_add', userController.userAddGet);
// router.post('/user_add', userController.userAddPost);
// router.get('/login',      userController.userLoginGet);
// router.post('/login',     userController.userLoginPost);
// router.get('/logout',     userController.userLogout);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/', userController.userList);

/**
 * @swagger
 * /users/user_add:
 *   get:
 *     summary: Show add user form
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Add user form
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added successfully
 */
router.get('/user_add', userController.userAddGet);
router.post('/user_add', userController.userAddPost);

/**
 * @swagger
 * /users/login:
 *   get:
 *     summary: Show login form
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Login form
 *   post:
 *     summary: Log in user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to galleries after successful login
 *       200:
 *         description: Login form with error message
 */
router.get('/login', userController.userLoginGet);
router.post('/login', userController.userLoginPost);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Log out user
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirect to home page
 */
router.get('/logout', userController.userLogout);

module.exports = router;