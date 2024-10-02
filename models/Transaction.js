const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    issueDate: { type: Date },
    returnDate: { type: Date },
    totalRent: { type: Number }
});

module.exports = mongoose.model('Transaction', transactionSchema);