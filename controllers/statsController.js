var asyncHandler = require('express-async-handler');
var User = require('../models/User');
var Gallery = require('../models/Gallery');
var Image = require('../models/Image');

exports.statsList = asyncHandler(async function(req, res, next) {
  var usersCount = await User.countDocuments();
  var galleriesCount = await Gallery.countDocuments();
  var imagesCount = await Image.countDocuments();

  res.render('stats', {
    title: 'Statistics',
    usersCount: usersCount,
    galleriesCount: galleriesCount,
    imagesCount: imagesCount,
  });
});