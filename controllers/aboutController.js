const express = require('express');

async function aboutController (req, res) {
    try {
        const cart = req.session.cart || {};
        // console.log(cart);
        res.render('about', {isAuthenticated: req.isAuthenticated(), user: req.user, cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = aboutController;