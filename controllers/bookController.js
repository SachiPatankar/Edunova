const Book = require('../models/Book.js');

exports.getBooksByName = async (req, res) => {
    try {
        const term = req.params.term;
        const books = await Book.find({ name: new RegExp(term, 'i') });
        
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found with the given name' });
        }
        
        res.json(books);
    } catch (error) {
        console.error('Error in getBooksByName:', error);
        res.status(500).json({ message: 'Server error while fetching books by name' });
    }
};

exports.getBooksByRentRange = async (req, res) => {
    try {
        const { minRent, maxRent } = req.query;

        if (!minRent || !maxRent) {
            return res.status(400).json({ message: 'Please provide both minRent and maxRent' });
        }

        const books = await Book.find({ rentPerDay: { $gte: minRent, $lte: maxRent } });
        
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found in the given rent range' });
        }

        res.json(books);
    } catch (error) {
        console.error('Error in getBooksByRentRange:', error);
        res.status(500).json({ message: 'Server error while fetching books by rent range' });
    }
};

exports.getBooksByFilters = async (req, res) => {
    try {
        const { category, term, minRent, maxRent } = req.query;

        if (!category || !term || !minRent || !maxRent) {
            return res.status(400).json({ message: 'Please provide category, term, minRent, and maxRent' });
        }

        const books = await Book.find({
            category,
            name: new RegExp(term, 'i'),
            rentPerDay: { $gte: minRent, $lte: maxRent }
        });

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the provided filters' });
        }

        res.json(books);
    } catch (error) {
        console.error('Error in getBooksByFilters:', error);
        res.status(500).json({ message: 'Server error while fetching books by filters' });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }

        res.json(books);
    } catch (error) {
        console.error('Error in getAllBooks:', error);
        res.status(500).json({ message: 'Server error while fetching all books' });
    }
};
