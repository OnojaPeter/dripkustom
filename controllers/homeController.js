const express = require('express');
const router = express.Router();
const Shoe = require ("../models/shoes")


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
            console.log(shoes)
        } else {
            shoes = await Shoe.find().sort(sortCriteria);
        }
        const cart = req.session.cart || {};
        // console.log(cart);
        res.render('index', { isAuthenticated: req.isAuthenticated(), user: req.user, messages: req.flash('error'), shoes, cartItems: cart });
        // console.log(req.user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
}

module.exports =  homeController;