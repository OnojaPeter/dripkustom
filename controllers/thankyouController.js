async function thankyouController (req, res) {
    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        res.render('thank-you', {cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = thankyouController;