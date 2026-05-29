var express = require('express');
var router = express.Router();
var statsController = require('../controllers/statsController');

router.get('/', statsController.statsList);

module.exports = router;