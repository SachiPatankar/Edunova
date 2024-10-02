const mongoose = require('mongoose');
require('dotenv').config();

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB connected.');
  } catch (err) {
    console.log('Mongoose: ', err);
  }
};
start();
