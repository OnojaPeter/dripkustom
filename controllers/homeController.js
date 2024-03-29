const express = require('express');
const router = express.Router();
const Shoe = require ("../models/shoes");
const ShoeBestseller = require ("../models/bestsellers");
const cookieParser = require('cookie-parser');


async function homeController (req, res) {
    try {
        const { category, sort } = req.query;
        
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
            // console.log(shoes)
        } else {
            shoes = await Shoe.find().sort(sortCriteria);
        }

        const bestsellerItems = await ShoeBestseller.find();
        const bestsellerIds = bestsellerItems.map(item => item.shoe); // Extract shoe IDs from bestseller items

        // console.log('bestseller IDs:', bestsellerIds);
        // Query the Shoe collection using the extracted IDs
        const ShoeBestsellers = await Shoe.find({ _id: { $in: bestsellerIds } });
        // console.log('Bestselling shoes:', ShoeBestsellers);

        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        res.render('index', { 
            isAuthenticated: req.isAuthenticated(), 
            user: req.user, 
            messages: req.flash('error'), 
            shoes, 
            ShoeBestsellers,
            cartItems: cart,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
}

module.exports =  homeController;