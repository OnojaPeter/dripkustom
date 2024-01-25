const express = require('express');
const router = express.Router();
const updateQuantityController = require('../controllers/updateQuantityController')

router.post('/', updateQuantityController);

module.exports = router;