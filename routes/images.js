var express = require('express');
var router = express.Router();
var imageController = require('../controllers/imageController');
var authenticate = require('../middleware/authenticate');

router.get('/', imageController.imageList);
router.get('/image_add',     authenticate, imageController.imageAddGet);
router.post('/image_add',    authenticate, imageController.imageAddPost);
// router.get('/image_to_gallery',   authenticate, imageController.imageToGalleryGet);
// router.post('/image_to_gallery',  authenticate, imageController.imageToGalleryPost);
router.get('/image_show',         authenticate, imageController.imageShowGet);

router.get('/image_update',       authenticate, imageController.imageUpdateGet);
router.post('/image_update',      authenticate, imageController.imageUpdatePost);
router.get('/image_delete',       authenticate, imageController.imageDeleteGet);

module.exports = router;