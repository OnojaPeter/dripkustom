const express = require('express');

async function aboutController (req, res) {
    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        // console.log(cart);
        res.render('about', {isAuthenticated: req.isAuthenticated(), user: req.user, cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = aboutController;