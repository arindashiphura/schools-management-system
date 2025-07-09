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

// Update a book by ID
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updateData = { ...req.body };
    // Remove undefined or empty string fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });
    const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 