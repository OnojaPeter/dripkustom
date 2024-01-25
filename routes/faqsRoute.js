const express = require('express');
const router = express.Router();
const faqsController = require('../controllers/faqsController')

router.get('/', faqsController);

module.exports = router;
