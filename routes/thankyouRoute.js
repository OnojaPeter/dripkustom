const express = require('express');
const router = express.Router();
const thankyouController = require('../controllers/thankyouController')

router.get('/', thankyouController);

module.exports = router;