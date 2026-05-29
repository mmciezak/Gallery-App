var express = require('express');
var router = express.Router();
var galleryController = require('../controllers/galleryController');

router.get('/', galleryController.galleryList);

module.exports = router;