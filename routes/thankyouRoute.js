const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware')
const thankyouController = require('../controllers/thankyouController')

router.get('/', isAuthenticated, thankyouController);

module.exports = router;