const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const cart = req.session.cart || {};
        const retrievedCartItems = Object.values(cart);

        let totalPrice = 0;
        retrievedCartItems.forEach((item) => {
            totalPrice += item.price * item.quantity;
        });
        // console.log(totalPrice);
        res.render('checkout', { cartItems: retrievedCartItems, totalPrice });
    } catch (error) {
        console.error('Error:', error);
    }
});

module.exports = router;