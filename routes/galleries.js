var express = require('express');
var router = express.Router();
var galleryController = require('../controllers/galleryController');
var authenticate = require('../middleware/authenticate');

// router.get('/', galleryController.galleryList);
// router.get('/gallery_add', authenticate, galleryController.galleryAddGet);
// router.post('/gallery_add', authenticate, galleryController.galleryAddPost);
// router.get('/gallery_browse',   authenticate, galleryController.galleryBrowseGet);
// router.post('/gallery_browse',  authenticate, galleryController.galleryBrowsePost);

/**
 * @swagger
 * /galleries:
 *   get:
 *     summary: Get all galleries
 *     tags: [Galleries]
 *     responses:
 *       200:
 *         description: List of all galleries
 */
router.get('/', galleryController.galleryList);

/**
 * @swagger
 * /galleries/gallery_add:
 *   get:
 *     summary: Show add gallery form
 *     tags: [Galleries]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Add gallery form
 *       401:
 *         description: Not logged in
 *   post:
 *     summary: Add a new gallery
 *     tags: [Galleries]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               owner:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gallery added successfully
 */
router.get('/gallery_add', authenticate, galleryController.galleryAddGet);
router.post('/gallery_add', authenticate, galleryController.galleryAddPost);

/**
 * @swagger
 * /galleries/gallery_browse:
 *   get:
 *     summary: Show gallery browser
 *     tags: [Galleries]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Gallery browser page
 *   post:
 *     summary: Browse images in selected gallery
 *     tags: [Galleries]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               gallery:
 *                 type: string
 *                 description: Gallery ID
 *     responses:
 *       200:
 *         description: Images in selected gallery
 */
router.get('/gallery_browse', authenticate, galleryController.galleryBrowseGet);
router.post('/gallery_browse', authenticate, galleryController.galleryBrowsePost);

module.exports = router;