async function updateQuantityController (req, res) {
    const { shoeId, quantity } = req.body;
    const shoeIdObject = shoeId.toString(); // Convert ObjectId to string

    try {
        const cart = req.session.cart || {};
        const cartItem = cart[shoeIdObject];

        if (cartItem) {
            // Update the quantity in the cart object
            cartItem.quantity = quantity;

            req.session.cart = cart;

            res.status(200).json({ message: 'Quantity updated in cart', updatedCartItems: cart });
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Error updating quantity' });
    }
}

module.exports = updateQuantityController;