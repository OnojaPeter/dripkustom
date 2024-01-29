async function removeFromCartController (req, res) {
    // console.log("inside the actual removing shit");
    const shoeId = req.body.shoeId;
    const shoeIdObject = shoeId.toString();

    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        const cartItem = cart[shoeIdObject];
        
        if (cartItem) {
            delete cart[shoeIdObject];
            res.cookie('cart', JSON.stringify(cart));
            console.log("deleted:", cartItem);
            res.status(200).send('Item removed from cart');
        }
    } catch (error) {
        res.status(404).send('Item not found in cart');
    }
}


module.exports = removeFromCartController;