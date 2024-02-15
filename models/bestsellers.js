const mongoose = require ('mongoose');

const bestsellerSchema = new mongoose.Schema({
    image: String,
    name: String,
    price: Number,
    category: String,
    createdAt: { type: Date, default: Date.now }
});
const ShoeBestseller = mongoose.model('ShoeBestseller', bestsellerSchema);


// const dummyItems = [
// //     { image: "https://res.cloudinary.com/djfrsyayo/image/upload/v1706575393/4ff9167ec73af7436ba02f8135192578_pqz7sv.jpg",name: 'new 1', price: 70, category: "nike"},
// //     { image: "/public/images/20201110_112950.jpg", name: 'Nike 2', price: 50, category: "nike"},
// //     { image: "/public/images/20201105_210955.jpg", name: 'Nike 3', price: 40, category: "nike"},
// //     { image: "/public/images/20201110_112901.jpg", name: 'Nike 4', price: 45, category: "nike"},
// { image: "/public/images/3fe053f71dad15b98b32b0bb7005f825.jpg", name: 'Adidas 1', price: 20, category: "adidas"},
// { image: "/public/images/7d77740b692425fa411ddf2b45825f51.jpg", name: 'Adidas 2', price: 25, category: "adidas"},
// // { image: "/public/images/3fe053f71dad15b98b32b0bb7005f825.jpg", name: 'Adidas 3', price: 51, category: "adidas"},
// // { image: "/public/images/20201110_112917.jpg", name: 'Adidas 4', price: 22, category: "adidas"},
// //     // Add more items as needed
// ];
// const populateDummyItems = async () => {
//     try {
//         const docs = await ShoeBestseller.insertMany(dummyItems);
//         console.log('Dummy items inserted:', docs);
//     } catch (err) {
//         console.error('Error populating items:', err);
//     }
// };

// populateDummyItems();

module.exports = ShoeBestseller