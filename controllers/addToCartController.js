const Shoe = require ("../models/shoes")
const cookieParser = require('cookie-parser');

async function addToCartController (req, res) {
    const shoeId = req.body.shoeId;
    const selectedSize = req.body.size; // Retrieve the selected size from the request body
    console.log(shoeId);
    console.log(selectedSize);
    try {
        const shoe = await Shoe.findById(shoeId);
        if (shoe) {
            const cartCookie = req.cookies.cart || '{}';
            const cart = JSON.parse(cartCookie);

            const cartItemKey =`${shoeId}-${selectedSize}`;
            console.log(cartItemKey);
    //   if (cart[shoeId]) {
    //     cart[shoeId].quantity++;
    //   } else {
    //     cart[shoeId] = { ...shoe.toObject(), quantity: 1 };
    //   }


    if (cart[cartItemKey]) {
        // If the item exists in the cart, increment its quantity
        cart[cartItemKey].quantity++;
    } else {
        // If the item doesn't exist in the cart, add it with quantity 1
        cart[cartItemKey] = { ...shoe.toObject(), size: selectedSize, quantity: 1 };
    }
    
        // if (cart[shoeId]) {
        //     // If the item exists in the cart, check if the size matches
        //     if (cart[shoeId].size === selectedSize) {
        //         console.log("size:",cart[shoeId].size);
        //         console.log("selected size:",selectedSize)
        //         cart[shoeId].quantity++;
        //     } else {
        //         console.log("size in else:",cart[shoeId].size);
        //         console.log("selected size in else:",selectedSize)
        //         // If the size doesn't match, consider it as a new item
        //         const newItem = { ...shoe.toObject(), size: selectedSize, quantity: 1 };
        //         cart[`${shoeId}-${selectedSize}`] = newItem; 
        //     }
        // } else {
        //     // If the item doesn't exist in the cart, add it with the selected size
        //     cart[shoeId] = { ...shoe.toObject(), size: selectedSize, quantity: 1 };
        // }

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