const User = require('../models/User.js');

exports.getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};