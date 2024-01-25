const Address = require ("../models/address")
const User = require('../models/user');

async function person (req,res) {
    try {        
        const cart = req.session.cart || {};
        res.render("profile", {cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
        console.error(error)
    }
}

async function editPerson (req,res) {
    try {
        const cart = req.session.cart || {};
        res.render("edit-profile", {cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
        console.error(error)
    }
}

async function editPersonPost (req,res) {
    try {
        res.redirect("/profile/person");
    } catch (error) {
        console.error(error)
    }
}

async function editPassword (req,res) {
    try {
        const cart = req.session.cart || {};
        res.render("edit-password", {cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
        console.error(error)
    }
}

async function address (req, res) {
    try {
        const userId = req.user._id;
        // const addressDetails = await Address.find();
        const userWithAddresses = await User.findById(userId).populate('addresses');
        console.log(userWithAddresses);

        if (!userWithAddresses) {
            // Handle the case where the user is not found
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the addresses from the populated 'addresses' field
        const addressDetails = userWithAddresses.addresses;
    //  console.log(addressDetails);
    const cart = req.session.cart || {};
        res.render("address", {cartItems: cart, address: addressDetails, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
      console.error('Error fetching address details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

async function editAddressPage (req, res) {
    try {
        const addressId = req.params.addressId;
        let addressDetails;

        if (addressId) {
            addressDetails = await Address.findById(addressId);
        } else {
            addressDetails = {};
        }

        const cart = req.session.cart || {};
        res.render('edit-address', { cartItems: cart, address: addressDetails , user: req.user, isAuthenticated: req.isAuthenticated()});     
    } catch (error) {
      console.error('Error fetching address details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
}

async function editAddressPost (req, res) {
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

            const userId = req.user._id;
            // console.log(userId)
            const user = await User.findById(userId);
            // console.log(user)
            
            if (user) {
                user.addresses.push(addressDetails);
                await user.save();
            }
            // console.log(user)
        }
        res.redirect("/profile/address");

    } catch (error) {
        console.error('Error handling address details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function order (req,res) {
    try {
        const cart = req.session.cart || {};
        res.render("order", {cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
        console.error(error)
    }
}

async function deleteAddress (req, res) {
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
}
module.exports = {
    person,
    editPerson,
    editPersonPost,
    editPassword,
    address,
    editAddressPage,
    editAddressPost,
    order,
    deleteAddress,
  };