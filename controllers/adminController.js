const ShoeBestseller = require('../models/bestsellers');
const Shoes = require('../models/shoes');

async function admin (req,res) {
    try {
      res.render('adminHomepage');
    } catch (error) {
      console.error(error);
    }
}

async function bestSellers (req,res) {
    try {
        const bestSellers = await ShoeBestseller.find()
        res.render('adminBestsellers', {bestSellers});
    } catch (error) {
        console.error(error);
    }
}

async function shoes (req,res) {
    try {
        const shoes = await Shoes.find()
        res.render('adminAllShoes', {shoes});
    } catch (error) {
        console.error(error);
    }
}

async function orders (req,res) {
    try {
      res.render('adminOrders');
    } catch (error) {
      console.error(error);
    }
}

module.exports = {
    admin,
    bestSellers,
    shoes,
    orders,
};