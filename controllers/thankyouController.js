async function thankyouController (req, res) {
    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        res.render('thank-you', {cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = thankyouController;