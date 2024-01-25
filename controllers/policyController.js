async function policyController (req, res) {
    try {
        const cart = req.session.cart || {};
        res.render('store-policy', {isAuthenticated: req.isAuthenticated(), user: req.user, messages: req.flash('error'), cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = policyController;