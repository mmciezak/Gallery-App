var express = require('express');
var router = express.Router();
var galleryController = require('../controllers/galleryController');
var authenticate = require('../middleware/authenticate');

router.get('/', galleryController.galleryList);
router.get('/gallery_add', authenticate, galleryController.galleryAddGet);
router.post('/gallery_add', authenticate, galleryController.galleryAddPost);

module.exports = router;