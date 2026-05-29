var asyncHandler = require('express-async-handler');
var Image = require('../models/Image');

exports.imageList = asyncHandler(async function(req, res, next) {
    var images = await Image.find();
    res.render('images', { title: 'Images', images: images });
});