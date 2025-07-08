const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  subject: { type: String, required: true },
  writerName: { type: String, required: true },
  class: { type: String, required: true },
  publishingYear: { type: String, required: true },
  uploadDate: { type: Date, required: true },
  idNo: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Book', bookSchema); 