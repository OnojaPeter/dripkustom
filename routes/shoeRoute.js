const express = require('express');
const router = express.Router();
const shoeController = require('../controllers/shoeController')

router.get('/:id', shoeController);

module.exports = router;