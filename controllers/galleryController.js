var asyncHandler = require('express-async-handler');
var Gallery = require('../models/Gallery');


exports.galleryList = asyncHandler(async function(req, res, next) {
    var galleries = await Gallery.find();
    res.render('galleries', { title: 'Galleries', galleries: galleries });

});