const Address = require ("../models/address")
const User = require('../models/user');
const Order = require('../models/orders');
const bcrypt = require('bcryptjs');

async function person (req,res) {
    try {     
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        res.render("profile", {cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
        console.error(error)
    }
}

async function editPerson (req,res) {
    try {
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
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
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        res.render("edit-password", {messages: req.flash('error'), cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated()});
    } catch (error) {
        console.error(error)
    }
}

async function editPasswordPost(req, res) {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        const user = req.user;

        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);

        // console.log(user);
        // console.log("req.body:",req.body);

        // Validate the old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            // return res.status(400).send('Old password is incorrect');
            return res.render('edit-password', { messages: ['Old password is incorrect'], cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated() });
        }

        // Validate that the new password and confirm password match
        if (newPassword !== confirmNewPassword) {
            // return res.status(400).send('New password and confirm password do not match');
            return res.render('edit-password', { messages: ['New password and confirm new password do not match'], cartItems: cart, user: req.user, isAuthenticated: req.isAuthenticated() });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        console.log('haspassword:', hashedPassword);

        // Update the user's password in the database
        user.password = hashedPassword;
        await user.save();

        res.redirect('/profile/person');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function address (req, res) {
    try {
        const userId = req.user._id;
        // console.log(userId);
        const userWithAddresses = await User.findById(userId).populate('addresses');
        // console.log(userWithAddresses);

        if (!userWithAddresses) {
            // Handle the case where the user is not found
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract the addresses from the populated 'addresses' field
        const addressDetails = userWithAddresses.addresses;
    //  console.log(addressDetails);
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
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

        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
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
        const returnTo = req.query.returnTo;
        console.log(returnTo);

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
        if (returnTo) {
            // console.log('here')
            res.redirect(returnTo); // Redirect to the specified URL (e.g., /checkout)
        } else {
        res.redirect("/profile/address");
        }

    } catch (error) {
        console.error('Error handling address details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function order (req,res) {
    try {
        const userId = req.user._id;
        // console.log(userId);
        const userIdToString = userId.toString();
        // console.log('user string:', userIdToString);

        const orderAssociatedWithUser = await Order.find({user: userIdToString}).populate('selectedAddress');
        // console.log('order Associated With User:', orderAssociatedWithUser);
        const cartCookie = req.cookies.cart || '{}';
        const cart = JSON.parse(cartCookie);
        res.render("order", {cartItems: cart, order: orderAssociatedWithUser, user: req.user, isAuthenticated: req.isAuthenticated()});
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
    editPasswordPost,
    address,
    editAddressPage,
    editAddressPost,
    order,
    deleteAddress,
  };