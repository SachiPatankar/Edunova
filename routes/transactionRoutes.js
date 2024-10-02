const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.post('/issue', transactionController.issueBook);
router.post('/return', transactionController.returnBook);
router.get('/history/:bookName', transactionController.getTransactionsByBookName);
router.get('/rent/:bookName', transactionController.getTotalRentByBookName);
router.get('/byUser', transactionController.getBooksIssuedByUser);
router.get('/date-range', transactionController.getBooksIssuedInDateRange);

module.exports = router;