const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    rentPerDay: { type: Number, required: true },
    isRented:{ type: Boolean, default:false}
});

module.exports = mongoose.model('Book', bookSchema);