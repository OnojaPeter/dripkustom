const Address = require ("../models/address")
const User = require('../models/user');

async function checkoutController (req, res) {
    try {
        const userId = req.user._id;
        // console.log(userId);
        const userWithAddresses = await User.findById(userId).populate('addresses');
        const addressDetails = userWithAddresses.addresses;
        // console.log(addressDetails);



        
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        const retrievedCartItems = Object.values(cart);

        let totalPrice = 0;
        retrievedCartItems.forEach((item) => {
            totalPrice += item.price * item.quantity;
        });
        // console.log(req.user.email);
        res.render('checkout', { isAuthenticated: req.isAuthenticated(), address: addressDetails, userEmail: req.user.email, user: req.user, messages: req.flash('error'), cartItems: retrievedCartItems, totalPrice });
    } catch (error) {
        res.redirect('/')
        console.error('Error:', error);
    }
}


module.exports = checkoutController;