const mongoose = require ('mongoose');
const Shoe = require ("../models/shoes")
const ShoeBestseller = require ("../models/bestsellers");


async function populateBestsellers() {
    try {
        // Find all shoes
        const allShoes = await Shoe.find();

        // Assume we manually choose some shoes to be bestsellers
        const bestsellers = allShoes.slice(0, 5); // Select the first 3 shoes as bestsellers

        // Populate the Bestsellers schema with the chosen shoes
        await ShoeBestseller.insertMany(bestsellers.map(shoe => ({ shoe: shoe._id })));

        console.log('Bestsellers populated successfully:', bestsellers);
    } catch (error) {
        console.error('Error populating bestsellers:', error);
    }
}

populateBestsellers();