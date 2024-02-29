const express = require('express');
const router = express.Router();
const {isAuthenticated, isAdmin} = require('../middleware');
const resetPasswordController = require('../controllers/resetPasswordController')

router.get('/forgot-password', resetPasswordController.forgotPasswordPage) 
router.get('/reset-password/:token', resetPasswordController.resetPassPage) 
router.post('/forgot-password', resetPasswordController.forgotPassword);
router.post('/reset-password/:token', resetPasswordController.resetPassword);

module.exports = router;