var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  first_name:{ type: String, maxLength: 100, required: true },
  last_name:{ type: String, maxLength: 100, required: true },
  username: { type: String, maxLength: 100, required: true, unique: true },
  //password:{ type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);