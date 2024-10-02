const Book = require('../models/Book.js');
const User = require('../models/User.js');
const fs = require('fs');

module.exports.add_Books = async (req,res) => {
    try {
        const books = JSON.parse(fs.readFileSync('./sampleData/books.json', 'utf8'));
        
        for (let i = 0; i < books.length; i++) {
            await Book.create({
                name: books[i].name,
                category: books[i].category,
                rentPerDay: books[i].rentPerDay,
            });
        }

        return res.json("Success");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.add_Users = async (req,res) => {
    try {
        const users = JSON.parse(fs.readFileSync('./sampleData/users.json', 'utf8'));
        
        for (let i = 0; i < users.length; i++) {
            await User.create({
                name: users[i].name,
                email: users[i].email,
                phone: users[i].phone,
            });
        }

        return res.json("Success");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
