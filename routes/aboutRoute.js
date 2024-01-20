const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        // console.log(retrievedCartItems);
        res.render('about', {cartItems: retrievedCartItems});
    } catch (error) {
        console.error('Error:', error);
    }
});

module.exports = router;