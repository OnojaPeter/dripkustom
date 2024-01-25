async function thankyouController (req, res) {
    try {
        const cart = req.session.cart || {};
        res.render('thank-you', {cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = thankyouController;