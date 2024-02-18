const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware')
const adminController = require('../controllers/adminController')

router.get("/", adminController.admin);
router.get("/bestsellers", adminController.bestSellers);
router.get("/all-shoes", adminController.shoes);
router.get("/orders", adminController.orders);


module.exports = router;