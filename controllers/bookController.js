const Book = require('../models/Book');

// Create a new book
exports.createBook = async (req, res) => {
  try {
    const { bookName, subject, writerName, class: className, publishingYear, uploadDate, idNo } = req.body;
    if (!bookName || !subject || !writerName || !className || !publishingYear || !uploadDate || !idNo) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const newBook = new Book({
      bookName,
      subject,
      writerName,
      class: className,
      publishingYear,
      uploadDate,
      idNo,
    });
    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ books });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 