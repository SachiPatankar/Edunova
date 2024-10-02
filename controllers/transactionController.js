const Transaction = require('../models/Transaction.js');
const Book = require('../models/Book.js');
const User = require('../models/User.js');

exports.issueBook = async (req, res) => {
    try {
        const { bookName, userId, username, issueDate } = req.body;

        let id;
        if (userId) {
            id = userId;  
        } else if (username) {
            const user = await User.findOne({ name: username });
          
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            id = user._id;  
        } else {
            return res.status(400).json({ message: 'Please provide either userId or username' });
        }

        const book = await Book.findOne({ name: bookName });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        if (book.isRented) return res.status(422).json({ message: 'Book already issued' });

        const transaction = new Transaction({ bookId: book._id, userId: id, issueDate });
        await transaction.save();

        book.isRented = true;
        await book.save();

        res.json(transaction);
    } catch (error) {
        console.error('Error in issueBook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.returnBook = async (req, res) => {
    try {
        const { bookName, userId, username, returnDate } = req.body;

        let id;
        if (userId) {
            id = userId;  
        } else if (username) {
            const user = await User.findOne({ name: username });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            id = user._id;  
        } else {
            
            return res.status(400).json({ message: 'Please provide either userId or username' });
        }

        const book = await Book.findOne({ name: bookName });
        if (!book) return res.status(404).json({ message: 'Book not found' });

        const transaction = await Transaction.findOne({ bookId: book._id, userId: id });
        if (!transaction || transaction.returnDate) {
            return res.status(400).json({ message: 'Invalid transaction or book already returned' });
        }

        transaction.returnDate = returnDate;
        const rentDays = Math.ceil((new Date(returnDate) - new Date(transaction.issueDate)) / (1000 * 60 * 60 * 24));
        transaction.totalRent = rentDays * book.rentPerDay;
        await transaction.save();

        book.isRented = false;
        await book.save();

        res.json(transaction);
    } catch (error) {
        console.error('Error in returnBook:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getTransactionsByBookName = async (req, res) => {
    try {
        const book = await Book.findOne({ name: req.params.bookName });
        if (!book) return res.status(404).json({ message: "Book not found" });

        const transactions = await Transaction.find({ bookId: book._id }).populate('userId', 'name');
        
        const pastIssuers = transactions.map(transaction => ({
            userId: transaction.userId._id,
            userName: transaction.userId.name,
            issueDate: transaction.issueDate,
            returnDate: transaction.returnDate || null 
        }));

       
        const currentIssuer = transactions.find(transaction => !transaction.returnDate);
        
        const response = {
            totalCount: pastIssuers.length,
            pastIssuers: pastIssuers,
            currentIssuer: currentIssuer ? {
                userId: currentIssuer.userId._id,
                userName: currentIssuer.userId.name,
                issueDate: currentIssuer.issueDate
            } : null
        };

        res.json(response);
    } catch (error) {
        console.error('Error in getTransactionsByBookName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getTotalRentByBookName = async (req, res) => {
    try {
        let bookName = req.params.bookName;
        const book = await Book.findOne({ name: bookName });
        if (!book) return res.status(404).json({ message: "Book not found" });

        const transactions = await Transaction.find({ bookId: book._id });
        if (!transactions.length) {
            return res.status(404).json({ message: 'No transactions found for the given book' });
        }

        const totalCount = transactions.reduce((acc, transaction) => acc + (transaction.totalRent || 0), 0);

        res.json({ name: bookName, totalRent: totalCount });
    } catch (error) {
        console.error('Error in getTotalRentByBookName:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



exports.getBooksIssuedByUser = async (req, res) => {
    try {
        const { username, userID } = req.body;
        let id;

        if (username) {
            const user = await User.findOne({ name: username });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            id = user._id;
        } else if (userID) {
            id = userID;
        } else {
            return res.status(400).json({ message: 'Please provide either username or userID' });
        }

        const transactions = await Transaction.find({ userId: id })
            .populate({ path: 'bookId', select: 'name' });

        if (!transactions.length) {
            return res.status(404).json({ message: 'No books issued to this user' });
        }

        const issuedBooks = transactions.map(transaction => transaction.bookId.name);

        res.json({ userId: id, issuedBooks });
    } catch (error) {
        console.error('Error in getBooksIssuedToUserId:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getBooksIssuedInDateRange = async (req, res) => {
    try {
        const { minDate, maxDate } = req.query;

        const transactions = await Transaction.find({
            issueDate: { $gte: new Date(minDate), $lte: new Date(maxDate) }
        })
            .populate({ path: 'bookId', select: 'name' })
            .populate({ path: 'userId', select: 'name' });

        if (!transactions.length) {
            return res.status(404).json({ message: 'No books issued in the given date range' });
        }

        const result = transactions.map(transaction => ({
            book: transaction.bookId.name,
            issuedTo: transaction.userId.name
        }));

        res.json(result);
    } catch (error) {
        console.error('Error in getBooksIssuedInDateRange:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
