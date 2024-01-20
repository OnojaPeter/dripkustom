const express = require('express');
const router = express.Router();
const Shoe = require ("../models/shoes")

router.post('/', async (req, res) => {
    const shoeId = req.body.shoeId;
    // console.log(shoeId);
    try {
        const shoe = await Shoe.findById(shoeId);
        if (shoe) {
            const cart = req.session.cart || {};
            // console.log(cart);
            const shoeIdString = shoeId.toString();
            console.log(shoeIdString);

            if (cart[shoeIdString]) {
                // If item exists in cart, increment its quantity
                cart[shoeIdString].quantity++;
            } else {
                // If item doesn't exist in cart, add it with quantity 1
                cart[shoeIdString] = { ...shoe.toObject(), quantity: 1 };
            }

            req.session.cart = cart;

            res.status(200).json({
                message: `"${shoe.name}" added to cart!`,
                cartItems: cart // Sending the updated cart
            });
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Error adding item to cart');
    }
});

module.exports = router;