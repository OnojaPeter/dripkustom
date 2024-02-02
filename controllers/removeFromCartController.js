async function removeFromCartController (req, res) {
    // console.log("inside the actual removing shit");
    const shoeId = req.body.shoeId;
    const shoeIdObject = shoeId.toString();
    // console.log(shoeIdObject);
    // console.log(shoeId);
    const selectedSize = req.body.size;
    console.log(selectedSize);

    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        // const cartItem = cart[shoeIdObject];
        const cartItemKey = selectedSize ? `${shoeId}-${selectedSize}` : shoeId;
        console.log(cartItemKey);

        const cartItem = cart[cartItemKey];
        
        if (cartItem) {
            delete cart[cartItemKey];
            res.cookie('cart', JSON.stringify(cart));
            console.log("deleted:", cartItem);
            res.status(200).send('Item removed from cart');
        }
    } catch (error) {
        res.status(404).send('Item not found in cart');
    }
}


module.exports = removeFromCartController;