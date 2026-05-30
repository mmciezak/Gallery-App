var asyncHandler = require('express-async-handler');
var { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var User = require('../models/User');
var { JWT_SECRET } = require('../config');

// GET /users - lista użytkowników
exports.userList = asyncHandler(async function(req, res, next) {
  var users = await User.find();
  res.render('users', { title: 'Users', users: users });
});

// GET /users/user_add
exports.userAddGet = asyncHandler(async function(req, res, next) {
  res.render('user_add', { title: 'Add User', errors: [], user: {}, success: null });
});

// POST /users/user_add
exports.userAddPost = [
  body('first_name').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters').escape(),
  body('last_name').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters').escape(),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters').isAlphanumeric().withMessage('Username can only contain letters and numbers').escape(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  asyncHandler(async function(req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('user_add', { title: 'Add User', errors: errors.array(), user: req.body, success: null });
      return;
    }

    var existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      res.render('user_add', {
        title: 'Add User',
        errors: [{ msg: `User "${req.body.username}" already exists` }],
        user: req.body,
        success: null,
      });
      return;
    }

    // hash
    var hashedPassword = await bcrypt.hash(req.body.password, 10);

    var user = new User({
      first_name: req.body.first_name,
      last_name:  req.body.last_name,
      username:   req.body.username,
      password:   hashedPassword,
    });
    await user.save();

    res.render('user_add', { title: 'Add User', errors: [], user: {}, success: `User "${req.body.username}" has been added!` });
  })
];

// GET /users/login
exports.userLoginGet = asyncHandler(async function(req, res, next) {
  res.render('user_login', { title: 'Login', errors: [], success: null });
});

// POST /users/login
exports.userLoginPost = [
  body('username').trim().notEmpty().withMessage('Username is required').escape(),
  body('password').notEmpty().withMessage('Password is required'),

  asyncHandler(async function(req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('user_login', { title: 'Login', errors: errors.array(), success: null });
      return;
    }

    //
    var user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.render('user_login', {
        title: 'Login',
        errors: [{ msg: 'Invalid username or password' }],
        success: null,
      });
      return;
    }

    var passwordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passwordMatch) {
      res.render('user_login', {
        title: 'Login',
        errors: [{ msg: 'Invalid username or password' }],
        success: null,
      });
      return;
    }

    var token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.redirect('/galleries');
  })
];

// GET /users/logout
exports.userLogout = function(req, res) {
  res.clearCookie('token');
  res.redirect('/');
};