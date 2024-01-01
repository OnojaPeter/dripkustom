const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { log } = require('util');
const path = require("path");

const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.use('css', express.static('public/css', { 'extensions': ['css']}));
// app.use(express.static('public'));

// app.use(
//     express.static(path.join(__dirname, "public"), {
//       setHeaders: (res, filePath) => {
//         if (filePath.endsWith(".css")) {
//           res.setHeader("Content-Type", "text/css");
//         }
//       },
//     }
//   ));
//     //MIME tailwindcss/base
//     app.get("/public/css/styles.css", (req, res) => {
//     res.setHeader("Content-Type", "text/css");
//     res.sendFile(path.join(__dirname, "public/css/styles.css"));
//     });
//     app.get("/public/css/output.css", (req, res) => {
//     res.setHeader("Content-Type", "text/css");
//     res.sendFile(path.join(__dirname, "public/css/output.css"));
//     });
//     // app.get("/public/css/tailwindcss/base", (req, res) => {
//     // res.setHeader("Content-Type", "text/css");
//     // res.sendFile(path.join(__dirname, "public/css/tailwindcss/base"));
//     // });
//     app.get("/public/js/script.js", (req, res) => {
//     res.setHeader("Content-Type", "application/javascript");
//     res.sendFile(path.join(__dirname, "public/js/script.js"));
//     });
//     app.get("/public/images/:imageName", (req, res) => {
//     // Get the image file name from the request parameters
//     const imageName = req.params.imageName;
    
//     // Determine the correct MIME type based on the file extension
//     let contentType;
//     if (imageName.endsWith(".png")) {
//         contentType = "image/png";
//     } else if (imageName.endsWith(".jpg") || imageName.endsWith(".jpeg")) {
//         contentType = "image/jpeg";
//     } else {
//         // You may need to add more MIME types for other image formats
//         // For example, for GIF, you can add: else if (imageName.endsWith(".gif")) contentType = "image/gif";
//     }
    
//     //Content-Type header based on the determined MIME type
//     res.setHeader("Content-Type", contentType);
    
//     // Serve the image file
//     res.sendFile(path.join(__dirname, "public/images", imageName));
//     });
    


app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/drip');
//{ useNewUrlParser: true, useUnifiedTopology: true }

// Define a schema and model for items
const shoeSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    category: String,
    createdAt: { type: Date, default: Date.now }
    // Add more fields as needed
});
const Shoe = mongoose.model('Shoe', shoeSchema);

// const dummyItems = [
//     { image: "/public/images/7d77740b692425fa411ddf2b45825f51.jpg",name: 'Nike 1', price: 80, category: "nike"},
//     { image: "/public/images/20201110_112950.jpg", name: 'Nike 2', price: 50, category: "nike"},
// { image: "/public/images/4ff9167ec73af7436ba02f8135192578.jpg", name: 'Adidas 1', price: 20, category: "adidas"},
// { image: "/public/images/9d1e24162babca5f650de973eaec89c7.jpg", name: 'Adidas 2', price: 25, category: "adidas"},
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


// const cartItems = []
// console.log(cartItems);
let cartItems = localStorage.getItem('cartItems');

// If cartItems exist in localStorage, parse it from JSON
if (cartItems) {
    cartItems = JSON.parse(cartItems);
} else {
    // If cartItems don't exist, initialize as an empty array
    cartItems = [];
}

app.get('/', async (req, res) => {
    try {
        // localStorage.clear();
        const { category, sort } = req.query;
        // console.log(sort);
        let shoes;
        let sortCriteria = {};

        if (sort === 'asc') {
            sortCriteria = { price: 1 }; // Sort by price ascending
        } else if (sort === 'desc') {
            sortCriteria = { price: -1 }; // Sort by price descending
        } else if (sort === 'recent') {
            shoes = await Shoe.find().sort({ createdAt: -1 });
        }

        if (category) {
            shoes = await Shoe.find({ category }).sort(sortCriteria);
        } else {
            shoes = await Shoe.find().sort(sortCriteria);
        }
        // const shoes = await Shoe.find();
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        // console.log(cartItems);
        res.render('index', { shoes, cartItems:retrievedCartItems });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});
app.get('/about', async (req, res) => {
    try {
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        // console.log(retrievedCartItems);
        res.render('about', {cartItems: retrievedCartItems});
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get('/faqs', async (req, res) => {
    try {
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        res.render('faqs', {cartItems: retrievedCartItems});
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get('/shoe/:id', async (req, res) => {
    const shoeId = req.params.id;
    // console.log(shoeId);
    try {
        const shoe = await Shoe.findById(shoeId);
        // console.log(shoe);
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        // console.log(retrievedCartItems);
        res.render('shoe', {shoe ,cartItems: retrievedCartItems});
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get('/store-policy', async (req, res) => {
    try {
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        res.render('store-policy', {cartItems: retrievedCartItems});
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get('/thank-you', async (req, res) => {
    try {
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        res.render('thank-you', {cartItems: retrievedCartItems});
    } catch (error) {
        console.error('Error:', error);
    }
});
app.get('/checkout', async (req, res) => {
    try {
        const retrievedCartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        let totalPrice = 0;
        retrievedCartItems.forEach((item) => {
            totalPrice += item.price * item.quantity;
        });
        // console.log(totalPrice);
        res.render('checkout', { cartItems: retrievedCartItems, totalPrice });
    } catch (error) {
        console.error('Error:', error);
    }
});


app.post('/add-to-cart', async (req, res) => {
    const shoeId = req.body.shoeId;
    // console.log(shoeId);
    const shoeIdObject = shoeId;
    // console.log(shoeIdObject)

    try {
        const shoe = await Shoe.findById(shoeId);
        // console.log(shoe)

        if (shoe) {
            // cartItems.push(shoe);
            // console.log(cartItems)
            const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

            // const existingItemIndex = cartItems.findIndex(shoe => shoe._id === shoeIdObject);
            const existingItemIndex = cartItems.findIndex(item => item._id === shoeIdObject);

            // console.log(existingItemIndex)

            if (existingItemIndex !== -1) {
                // If item exists in cart, increment its quantity
                cartItems[existingItemIndex].quantity++; 
                // localStorage.setItem('cartItems', JSON.stringify(cartItems));
            } else {
                // If item doesn't exist in cart, add it with quantity 1
                cartItems.push({ ...shoe.toObject(), quantity: 1 });
                // localStorage.setItem('cartItems', JSON.stringify(cartItems));
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
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
    const shoeIdObject = shoeId;
    // console.log(itemId)
    // console.log(quantity )
    try {
        const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        // console.log("Cart items before update:", cartItems);
        const existingItemIndex = cartItems.findIndex(item => item._id === shoeIdObject);
        // console.log("Existing item index:", existingItemIndex);

    if (existingItemIndex !== -1) {
        // Update the quantity in the cartItems array
        cartItems[existingItemIndex].quantity = quantity;

        // Respond with a success message or updated cart data
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log("Cart items after update:", cartItems);
        res.status(200).json({ message: 'Quantity updated in cart', updatedCartItems: cartItems });
    }
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Error updating quantity' });
    }
});
// Backend route to remove an item from the cart
app.post('/remove-from-cart',async (req, res) => {
    // console.log("inside the actual removing shit");
    const shoeId = req.body.shoeId;
    const shoeIdObject = shoeId;
    // console.log(shoeId);
    // console.log(shoeIdObject);

    try {
        const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];
        const indexToRemove = cartItems.findIndex(shoe => shoe._id === shoeIdObject);
        // console.log(indexToRemove);
    if (indexToRemove !== -1) {
        cartItems.splice(indexToRemove, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log("deleted:", cartItems);
        res.status(200).send('Item removed from cart');
    }
    } catch (error) {
        res.status(404).send('Item not found in cart');
    }
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});