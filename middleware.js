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

function isAdmin (req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        // console.log('isadmin-yes');
        return next();
    }
    res.status(403).send('Forbidden');
};


module.exports = {
    isAuthenticated,
    isAdmin,
}