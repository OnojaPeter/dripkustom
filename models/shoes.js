const mongoose = require ('mongoose');

const shoeSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    category: String,
    createdAt: { type: Date, default: Date.now }
});
const Shoe = mongoose.model('Shoe', shoeSchema);


// const dummyItems = [
//     { image: "/public/images/7d77740b692425fa411ddf2b45825f51.jpg",name: 'Nike 1', price: 80, category: "nike"},
//     { image: "/public/images/20201110_112950.jpg", name: 'Nike 2', price: 50, category: "nike"},
//     { image: "/public/images/20201105_210955.jpg", name: 'Nike 3', price: 40, category: "nike"},
//     { image: "/public/images/20201110_112901.jpg", name: 'Nike 4', price: 45, category: "nike"},
// { image: "/public/images/4ff9167ec73af7436ba02f8135192578.jpg", name: 'Adidas 1', price: 20, category: "adidas"},
// { image: "/public/images/9d1e24162babca5f650de973eaec89c7.jpg", name: 'Adidas 2', price: 25, category: "adidas"},
// { image: "/public/images/3fe053f71dad15b98b32b0bb7005f825.jpg", name: 'Adidas 3', price: 51, category: "adidas"},
// { image: "/public/images/20201110_112917.jpg", name: 'Adidas 4', price: 22, category: "adidas"},
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

module.exports = Shoe