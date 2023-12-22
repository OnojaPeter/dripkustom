const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { log } = require('util');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/drip');
//{ useNewUrlParser: true, useUnifiedTopology: true }

// Define a schema and model for items
const shoeSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    // Add more fields as needed
});
const Shoe = mongoose.model('Shoe', shoeSchema);

// const dummyItems = [
//     { image: "/public/images/7d77740b692425fa411ddf2b45825f51.jpg",name: 'Item 1', price: 10 },
//     { image: "/public/images/20201110_112950.jpg", name: 'Item 2', price: 20 },
//     // Add more items as needed
// ];
// const populateDummyItems = async () => {
//     try {
//         const docs = await Shoe.insertMany(dummyItems);
//         console.log('Dummy items inserted:', docs);
//     } catch (err) {
//         console.error('Error populating items:', err);
//     }
// };

// populateDummyItems();


const cartItems = []
// console.log(cartItems);
app.get('/', async (req, res) => {
    try {
        const shoes = await Shoe.find(); // Fetch items from MongoDB
        // console.log(shoes);
        res.render('index', { shoes,cartItems });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});


// Route to handle adding an item to the cart
app.post('/add-to-cart', async (req, res) => {
    const shoeId = req.body.shoeId;
    // console.log(shoeId);
    const shoeIdObject = mongoose.Types.ObjectId.createFromHexString(shoeId);
    // console.log(itemIdObject)

    try {
        const shoe = await Shoe.findById(shoeId);
        // console.log(shoe)

        if (shoe) {
            // cartItems.push(shoe);
            // console.log(cartItems)

            const existingItemIndex = cartItems.findIndex(shoe => shoe._id.equals(shoeIdObject));

            // console.log(existingItemIndex)

            if (existingItemIndex !== -1) {
                // If item exists in cart, increment its quantity
                cartItems[existingItemIndex].quantity++; 
            } else {
                // If item doesn't exist in cart, add it with quantity 1
                cartItems.push({ ...shoe.toObject(), quantity: 1 });
            }
            res.status(200).json({
                message: `"${shoe.name}" added to cart!`,
                cartItems: cartItems // Sending the updated cart
            });
        } else {
            res.status(404).send('Item not found');
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Error adding item to cart');
    }
});
app.post('/update-quantity', async (req, res) => {
    const { shoeId, quantity } = req.body;
    const shoeIdObject = mongoose.Types.ObjectId.createFromHexString(shoeId);
    // console.log(itemId)
    // console.log(quantity )
    try {
        const existingItemIndex = cartItems.findIndex(shoe => shoe._id.equals(shoeIdObject));
        // console.log(existingItemIndex);

    if (existingItemIndex !== -1) {
        // Update the quantity in the cartItems array
        cartItems[existingItemIndex].quantity = quantity;

        // Respond with a success message or updated cart data
        res.status(200).json({ message: 'Quantity updated in cart', updatedCartItems: cartItems });
    }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Error updating quantity' });
    }
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});