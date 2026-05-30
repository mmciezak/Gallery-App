var asyncHandler = require('express-async-handler');
var { body, validationResult } = require('express-validator');
var Gallery = require('../models/Gallery');
var User = require('../models/User');

exports.galleryList = asyncHandler(async function(req, res, next) {
  var galleries = await Gallery.find().populate('owner');
  res.render('galleries', { title: 'Galleries', galleries: galleries });
});

exports.galleryAddGet = asyncHandler(async function(req, res, next) {
  var isAdmin = req.user.username === 'admin';
  var users = isAdmin ? await User.find() : null;
  var currentUser = await User.findById(req.user.id);

  res.render('gallery_add', {
    title: 'Add Gallery',
    users: users,
    isAdmin: isAdmin,
    currentUser: currentUser,
    errors: [],
    gallery: {},
    success: null,
  });
});

exports.galleryAddPost = [
  body('name').trim().isLength({ min: 3 }).withMessage('Gallery name must be at least 3 characters').escape(),
  body('description').trim().escape(),

  asyncHandler(async function(req, res, next) {
    var errors = validationResult(req);
    var isAdmin = req.user.username === 'admin';
    var users = isAdmin ? await User.find() : null;
    var currentUser = await User.findById(req.user.id);

    var ownerId = isAdmin ? req.body.owner : req.user.id;

    if (!errors.isEmpty()) {
      res.render('gallery_add', {
        title: 'Add Gallery',
        users: users,
        isAdmin: isAdmin,
        currentUser: currentUser,
        errors: errors.array(),
        gallery: req.body,
        success: null,
      });
      return;
    }

    var existingGallery = await Gallery.findOne({ name: req.body.name, owner: ownerId });
    if (existingGallery) {
      res.render('gallery_add', {
        title: 'Add Gallery',
        users: users,
        isAdmin: isAdmin,
        currentUser: currentUser,
        errors: [{ msg: `Gallery "${req.body.name}" already exists for this user` }],
        gallery: req.body,
        success: null,
      });
      return;
    }

    var gallery = new Gallery({
      name: req.body.name,
      description: req.body.description,
      owner: ownerId,
    });
    await gallery.save();

    res.render('gallery_add', {
      title: 'Add Gallery',
      users: users,
      isAdmin: isAdmin,
      currentUser: currentUser,
      errors: [],
      gallery: {},
      success: `Gallery "${req.body.name}" has been added!`,
    });
  })
];