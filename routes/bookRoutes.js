const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/byterm/:term', bookController.getBooksByName);
router.get('/rent-range', bookController.getBooksByRentRange);
router.get('/filters', bookController.getBooksByFilters);
router.get('/all', bookController.getAllBooks);

module.exports = router;