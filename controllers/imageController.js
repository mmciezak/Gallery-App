var asyncHandler = require('express-async-handler');
var { body, validationResult } = require('express-validator');
var { formidable } = require('formidable');
var path = require('path');
var fs = require('fs');
var Image = require('../models/Image');
var Gallery = require('../models/Gallery');

exports.imageList = asyncHandler(async function(req, res, next) {
  var images = await Image.find().populate('gallery');
  res.render('images', { title: 'Images', images: images });
});

exports.imageShowGet = asyncHandler(async function(req, res, next) {
  var image = await Image.findById(req.query.id).populate('gallery');

  if (!image) {
    return res.render('error', { message: 'Image not found.', error: { status: 404 } });
  }

  res.render('image_show', {
    title: image.name,
    image: image,
    galleryId: req.query.gallery,
  });
});

exports.imageAddGet = asyncHandler(async function(req, res, next) {
  var isAdmin = req.user.username === 'admin';
  var galleries = isAdmin
    ? await Gallery.find().populate('owner')
    : await Gallery.find({ owner: req.user.id }).populate('owner');

  res.render('image_add', {
    title: 'Upload & Add Image',
    galleries: galleries,
    errors: [],
    success: null,
  });
});

exports.imageAddPost = asyncHandler(async function(req, res, next) {
  var isAdmin = req.user.username === 'admin';
  var galleries = isAdmin
    ? await Gallery.find().populate('owner')
    : await Gallery.find({ owner: req.user.id }).populate('owner');

  var uploadDir = path.join(__dirname, '..', 'public', 'images');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  var form = formidable({
    uploadDir: uploadDir,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024,
    filter: function({ mimetype }) {
      return mimetype && mimetype.startsWith('image/');
    }
  });

  form.parse(req, async function(err, fields, files) {
    if (err) {
      res.render('image_add', {
        title: 'Upload & Add Image',
        galleries: galleries,
        errors: [{ msg: 'Upload error: ' + err.message }],
        success: null,
      });
      return;
    }

    var file = files.image?.[0];
    var name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    var description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
    var galleryId = Array.isArray(fields.gallery) ? fields.gallery[0] : fields.gallery;

    var errors = [];
    if (!name || name.trim().length < 2) errors.push({ msg: 'Image name must be at least 2 characters' });
    if (!galleryId) errors.push({ msg: 'Please select a gallery' });
    if (!file) errors.push({ msg: 'Please select an image file' });

    if (errors.length > 0) {
      res.render('image_add', {
        title: 'Upload & Add Image',
        galleries: galleries,
        errors: errors,
        success: null,
      });
      return;
    }

    if (!isAdmin) {
      var gallery = await Gallery.findOne({ _id: galleryId, owner: req.user.id });
      if (!gallery) {
        res.render('image_add', {
          title: 'Upload & Add Image',
          galleries: galleries,
          errors: [{ msg: 'You can only add images to your own galleries' }],
          success: null,
        });
        return;
      }
    }

    var filename = path.basename(file.filepath);

    var image = new Image({
      name: name.trim(),
      description: description ? description.trim() : '',
      path: filename,
      gallery: galleryId,
    });
    await image.save();

    res.render('image_add', {
      title: 'Upload & Add Image',
      galleries: galleries,
      errors: [],
      success: `Image "${name}" uploaded and added to gallery!`,
    });
  });
});

exports.imageUpdateGet = asyncHandler(async function(req, res, next) {
  var image = await Image.findById(req.query.id).populate('gallery');

  if (!image) {
    return res.render('error', { message: 'Image not found.', error: { status: 404 } });
  }

  var isAdmin = req.user.username === 'admin';
  if (!isAdmin) {
    var gallery = await Gallery.findOne({ _id: image.gallery._id, owner: req.user.id });
    if (!gallery) {
      return res.render('error', { message: 'Access denied. You are not the owner of this gallery.', error: { status: 403 } });
    }
  }

  res.render('image_update', {
    title: 'Update Image',
    image: image,
    galleryId: req.query.gallery,
    errors: [],
    success: null,
  });
});

exports.imageUpdatePost = [
  body('name').trim().isLength({ min: 2 }).withMessage('Image name must be at least 2 characters').escape(),
  body('description').trim().escape(),

  asyncHandler(async function(req, res, next) {
    var image = await Image.findById(req.query.id).populate('gallery');

    if (!image) {
      return res.render('error', { message: 'Image not found.', error: { status: 404 } });
    }

    var isAdmin = req.user.username === 'admin';
    if (!isAdmin) {
      var gallery = await Gallery.findOne({ _id: image.gallery._id, owner: req.user.id });
      if (!gallery) {
        return res.render('error', { message: 'Access denied.', error: { status: 403 } });
      }
    }

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('image_update', {
        title: 'Update Image',
        image: image,
        galleryId: req.body.galleryId,
        errors: errors.array(),
        success: null,
      });
      return;
    }

    image.name = req.body.name;
    image.description = req.body.description;
    await image.save();

    res.render('image_update', {
      title: 'Update Image',
      image: image,
      galleryId: req.body.galleryId,
      errors: [],
      success: 'Image updated successfully!',
    });
  })
];

exports.imageDeleteGet = asyncHandler(async function(req, res, next) {
  var image = await Image.findById(req.query.id);

  if (!image) {
    return res.render('error', { message: 'Image not found.', error: { status: 404 } });
  }

  var isAdmin = req.user.username === 'admin';
  if (!isAdmin) {
    var gallery = await Gallery.findOne({ _id: image.gallery, owner: req.user.id });
    if (!gallery) {
      return res.render('error', { message: 'Access denied.', error: { status: 403 } });
    }
  }

  var filePath = path.join(__dirname, '..', 'public', 'images', image.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await Image.findByIdAndDelete(req.query.id);

  res.redirect('/galleries/gallery_browse');
});