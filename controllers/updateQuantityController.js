const cookieParser = require('cookie-parser');

async function updateQuantityController (req, res) {
    const { shoeId, quantity } = req.body;

    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        console.log(cart);
        const cartItem = cart[shoeId];

        if (cartItem) {
            // Update the quantity in the cart object
            cartItem.quantity = quantity;

            res.cookie('cart', JSON.stringify(cart));
            console.log(cart);

            res.status(200).json({ message: 'Quantity updated in cart', updatedCartItems: cart });
        } else {
            // If the cart has a key with the shoeId-size format, update its quantity
            const sizeKeys = Object.keys(cart).filter(key => key.startsWith(`${shoeId}-`));
            if (sizeKeys.length > 0) {
                sizeKeys.forEach(sizeKey => {
                    cart[sizeKey].quantity = quantity;
                });
                res.cookie('cart', JSON.stringify(cart));
                res.status(200).json({ message: 'Quantity updated in cart', updatedCartItems: cart });
            } else {
                res.status(404).json({ error: 'Item not found in cart' });
            }
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Error updating quantity' });
    }
}

module.exports = updateQuantityController;