const Shoe = require ("../models/shoes")
const ShoeBestseller = require ("../models/bestsellers");
const cookieParser = require('cookie-parser');

async function addToCartController (req, res) {
    const shoeId = req.body.shoeId;
    const selectedSize = req.body.size; // Retrieve the selected size from the request body
    console.log(shoeId);
    console.log(selectedSize);
    try {
        var shoe = await Shoe.findById(shoeId);
        if(shoe === null) {
            var shoe = await ShoeBestseller.findById(shoeId);
        }
        console.log(shoe);
        if (shoe) {
            const cartCookie = req.cookies.cart || '{}';
            const cart = JSON.parse(cartCookie);

            const cartItemKey =`${shoeId}-${selectedSize}`;
            console.log(cartItemKey);

            if (cart[cartItemKey]) {
                // If the item exists in the cart, increment its quantity
                cart[cartItemKey].quantity++;
            } else {
                // If the item doesn't exist in the cart, add it with quantity 1
                cart[cartItemKey] = { ...shoe.toObject(), size: selectedSize, quantity: 1 };
            }

            // Set the updated cart in the cookie
            res.cookie('cart', JSON.stringify(cart));

                res.status(200).json({
                    message: `"${shoe.name}" added to cart!`,
                    cartItems: cart // Sending the updated cart
                });
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Error adding item to cart');
    }
}

module.exports = addToCartController;