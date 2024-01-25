const Shoe = require ("../models/shoes")

async function shoeController (req, res) {
    const shoeId = req.params.id;
    // console.log(shoeId);
    try {
        const shoe = await Shoe.findById(shoeId);
        // console.log(shoe);
        const cart = req.session.cart || {};
        res.render('shoe', {isAuthenticated: req.isAuthenticated(), user: req.user, messages: req.flash('error'), shoe ,cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = shoeController