const express = require('express');
const router = express.Router();
const Shoe = require ("../models/shoes")

router.get('/:id', async (req, res) => {
    const shoeId = req.params.id;
    // console.log(shoeId);
    try {
        const shoe = await Shoe.findById(shoeId);
        // console.log(shoe);
        const cart = req.session.cart || {};
        res.render('shoe', {shoe ,cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
});

module.exports = router;