var asyncHandler = require('express-async-handler');
var User = require('../models/User');
var { body, validationResult } = require('express-validator');

exports.userList = asyncHandler(async function(req, res, next) {
    var users = await User.find();
    res.render('users', { title: 'Users', users: users });

});



// GET /users - lista użytkowników
exports.userList = asyncHandler(async function(req, res, next) {
  var users = await User.find();
  res.render('users', { title: 'Użytkownicy', users: users });
});

// GET /users/user_add - formularz dodawania
exports.userAddGet = asyncHandler(async function(req, res, next) {
  res.render('user_add', { title: 'Dodaj użytkownika', errors: [], user: {} });
});

// POST /users/user_add - przetworzenie formularza
exports.userAddPost = [
  // Walidacja i sanityzacja
  body('first_name')
    .trim()
    .isLength({ min: 2 }).withMessage('Imię musi mieć minimum 2 znaki')
    .escape(),
  body('last_name')
    .trim()
    .isLength({ min: 2 }).withMessage('Nazwisko musi mieć minimum 2 znaki')
    .escape(),
  body('username')
    .trim()
    .isLength({ min: 3 }).withMessage('Nazwa użytkownika musi mieć minimum 3 znaki')
    .isAlphanumeric().withMessage('Nazwa użytkownika może zawierać tylko litery i cyfry')
    .escape(),

  asyncHandler(async function(req, res, next) {
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Błędy walidacji – wróć do formularza z błędami
      res.render('user_add', {
        title: 'Dodaj użytkownika',
        errors: errors.array(),
        user: req.body,
        success: null,
      });
      return;
    }

    // Sprawdź czy użytkownik już istnieje
    var existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      res.render('user_add', {
        title: 'Dodaj użytkownika',
        errors: [{ msg: `Użytkownik "${req.body.username}" już istnieje w bazie` }],
        user: req.body,
        success: null,
      });
      return;
    }

    // Zapisz nowego użytkownika
    var user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
    });
    await user.save();

    // Sukces – pusty formularz z komunikatem
    res.render('user_add', {
      title: 'Dodaj użytkownika',
      errors: [],
      user: {},
      success: `Użytkownik "${req.body.username}" został dodany!`,
    });
  })
];