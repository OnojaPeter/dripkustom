const express = require('express');
const router = express.Router();
// const Shoe = require ("../models/shoes");

router.post('/',async (req, res) => {
    // console.log("inside the actual removing shit");
    const shoeId = req.body.shoeId;
    const shoeIdObject = shoeId.toString();

    try {
        const cart = req.session.cart || {};
        const cartItem = cart[shoeIdObject];
        
        if (cartItem) {
            delete cart[shoeIdObject];
            req.session.cart = cart;
            console.log("deleted:", cartItem);
            res.status(200).send('Item removed from cart');
        }
    } catch (error) {
        res.status(404).send('Item not found in cart');
    }
});

module.exports = router;