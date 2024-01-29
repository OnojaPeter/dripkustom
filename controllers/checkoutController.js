

async function checkoutController (req, res) {
    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        const retrievedCartItems = Object.values(cart);

        let totalPrice = 0;
        retrievedCartItems.forEach((item) => {
            totalPrice += item.price * item.quantity;
        });
        // console.log(totalPrice);
        res.render('checkout', { isAuthenticated: req.isAuthenticated(), user: req.user, messages: req.flash('error'), cartItems: retrievedCartItems, totalPrice });
    } catch (error) {
        console.error('Error:', error);
    }
}


module.exports = checkoutController;