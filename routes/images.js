var express = require('express');
var router = express.Router();
var imageController = require('../controllers/imageController');
var authenticate = require('../middleware/authenticate');

// router.get('/', imageController.imageList);
// router.get('/image_add',     authenticate, imageController.imageAddGet);
// router.post('/image_add',    authenticate, imageController.imageAddPost);
// // router.get('/image_to_gallery',   authenticate, imageController.imageToGalleryGet);
// // router.post('/image_to_gallery',  authenticate, imageController.imageToGalleryPost);
// router.get('/image_show',         authenticate, imageController.imageShowGet);

// router.get('/image_update',       authenticate, imageController.imageUpdateGet);
// router.post('/image_update',      authenticate, imageController.imageUpdatePost);
// router.get('/image_delete',       authenticate, imageController.imageDeleteGet);

/**
 * @swagger
 * /images:
 *   get:
 *     summary: Get all images
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: List of all images
 */
router.get('/', imageController.imageList);

/**
 * @swagger
 * /images/image_add:
 *   get:
 *     summary: Show upload image form
 *     tags: [Images]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Upload form
 *   post:
 *     summary: Upload image and add to gallery
 *     tags: [Images]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               gallery:
 *                 type: string
 *     responses:
 *       200:
 *         description: Image uploaded and added to gallery
 */
router.get('/image_add', authenticate, imageController.imageAddGet);
router.post('/image_add', authenticate, imageController.imageAddPost);

/**
 * @swagger
 * /images/image_show:
 *   get:
 *     summary: Show image in full size
 *     tags: [Images]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Image ID
 *       - in: query
 *         name: gallery
 *         schema:
 *           type: string
 *         description: Gallery ID
 *     responses:
 *       200:
 *         description: Image detail page
 *       404:
 *         description: Image not found
 */
router.get('/image_show', authenticate, imageController.imageShowGet);

/**
 * @swagger
 * /images/image_update:
 *   get:
 *     summary: Show update image form
 *     tags: [Images]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Update form
 *       403:
 *         description: Access denied
 *   post:
 *     summary: Update image data
 *     tags: [Images]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Image updated successfully
 */
router.get('/image_update', authenticate, imageController.imageUpdateGet);
router.post('/image_update', authenticate, imageController.imageUpdatePost);

/**
 * @swagger
 * /images/image_delete:
 *   get:
 *     summary: Delete image
 *     tags: [Images]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to gallery browse after deletion
 *       403:
 *         description: Access denied
 *       404:
 *         description: Image not found
 */
router.get('/image_delete', authenticate, imageController.imageDeleteGet);

module.exports = router;