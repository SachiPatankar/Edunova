const express = require('express');
const router = express.Router();
const addDataController = require('../controllers/addDataController');

router.post('/books', addDataController.add_Books);
router.post('/users', addDataController.add_Users);

module.exports = router;