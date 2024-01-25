const express = require('express');
const router = express.Router();




function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // If the user is authenticated, proceed to the next middleware
        return next();
    } else {
        // If not authenticated, redirect to the login page or handle as needed
        res.redirect('/');
    }
}


module.exports = isAuthenticated