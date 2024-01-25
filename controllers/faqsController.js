async function faqsController (req, res) {
    try {
        const cart = req.session.cart || {};
        res.render('faqs', {isAuthenticated: req.isAuthenticated(), user: req.user, messages: req.flash('error'), cartItems: cart});
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = faqsController;