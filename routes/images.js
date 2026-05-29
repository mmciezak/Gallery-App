var express = require('express');
var router = express.Router();
var imageController = require('../controllers/imageController');

router.get('/', imageController.imageList);

module.exports = router;