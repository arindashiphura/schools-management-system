const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
  parentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String },
  occupation: { type: String },
  address: { type: String },
  mobile: { type: String },
  email: { type: String },
  photo: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Parent', parentSchema); 