const express = require('express');
const router = express.Router();
const Address = require ("../models/address")

router.get("/person", async (req,res) => {
    try {        
        const cart = req.session.cart || {};
        res.render("profile", {cartItems: cart});
    } catch (error) {
        console.error(error)
    }
});

router.get("/edit-person", async (req,res) => {
    try {
        const cart = req.session.cart || {};
        res.render("edit-profile", {cartItems: cart});
    } catch (error) {
        console.error(error)
    }
});

router.get("/edit-password", async (req,res) => {
    try {
        const cart = req.session.cart || {};
        res.render("edit-password", {cartItems: cart});
    } catch (error) {
        console.error(error)
    }
});

router.get('/address', async (req, res) => {
    try {
        const addressDetails = await Address.find();
    //  console.log(addressDetails);
    const cart = req.session.cart || {};
        res.render("address", {cartItems: cart, address: addressDetails});
    } catch (error) {
      console.error('Error fetching address details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/edit-address/:addressId?', async (req, res) => {
    try {
        const addressId = req.params.addressId;
        let addressDetails;

        if (addressId) {
            addressDetails = await Address.findById(addressId);
        } else {
            addressDetails = {};
        }

        const cart = req.session.cart || {};
        res.render('edit-address', { cartItems: cart, address: addressDetails });     
    } catch (error) {
      console.error('Error fetching address details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});

router.get("/order", async (req,res) => {
    try {
        const cart = req.session.cart || {};
        res.render("order", {cartItems: cart});
    } catch (error) {
        console.error(error)
    }
});

router.post('/edit-address/:addressId?' , async (req, res) => {
    try {
        const addressId = req.params.addressId;
        // console.log(addressId);
        let addressDetails;

        if (addressId) {
            // Logic to update existing address
            addressDetails = await Address.findByIdAndUpdate(addressId, req.body, { new: true });
            // console.log(addressDetails);
        } else {
            // Logic to create a new address
            addressDetails = await Address.create(req.body);
            // console.log(addressDetails);
        }
        res.redirect("/profile/address");

    } catch (error) {
        console.error('Error handling address details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/edit-person", async (req,res) => {
    try {

        res.redirect("/profile/person");
    } catch (error) {
        console.error(error)
    }
});

router.delete('/delete-address/:addressId', async (req, res) => {
    try {
        const addressId = req.params.addressId;
        console.log(addressId);
        // Delete the address by ID
        const deletedAddress = await Address.findByIdAndDelete(addressId);

        if (!deletedAddress) {
            return res.status(404).json({ message: 'Address not found' });
        }

        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        console.error('Error deleting address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;