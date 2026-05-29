var mongoose = require('mongoose');

var gallerySchema = new mongoose.Schema({
  name:{ type: String, maxLength: 100, required: true },
  description:{ type: String, maxLength: 200 },
  update_time:{ type: Date },
  owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);