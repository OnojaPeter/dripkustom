const express = require('express');
const router = express.Router();
const removeFromCartController = require('../controllers/removeFromCartController')
// const Shoe = require ("../models/shoes");

router.post('/', removeFromCartController);

module.exports = router;