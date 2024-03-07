const Order = require('../models/orders')
const Address = require ("../models/address")

async function thankyouController (req, res) {
    try {
        // Retrieve the order ID from the query parameter
        const orderId = req.query.orderId;
        // console.log('orderId:' ,orderId);

        const order = await Order.findById(orderId).populate('selectedAddress');
        // console.log('order:',order);

        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);

        res.render('thank-you', { order, cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated() });
    } catch (error) {
        console.error('Error rendering thank you page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = thankyouController;