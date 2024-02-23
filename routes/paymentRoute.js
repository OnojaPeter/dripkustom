const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware')
const paymentController = require('../controllers/paymentController')

router.post("/payment-success", paymentController.paymentSuccess);
router.post("/create-checkout-session", paymentController.stripePayment);

module.exports = router;