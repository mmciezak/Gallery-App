var mongoose = require('mongoose');

var ImageSchema = new mongoose.Schema({
    name: {type: String, maxLength: 100, required: true },
    description: {type: String, maxLength: 200},
    path: {type: String, maxLength: 255},
    gallery: {type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', required: true}

}, { collection: 'images' });

module.exports = mongoose.model('Image', ImageSchema);