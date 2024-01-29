const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');

async function signup(req, res, next) {
  try {
    const {signupUsername, email, signupPassword } = req.body;
    // console.log(req.body);
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const newUser = new User({ username: signupUsername, email, password: signupPassword });
    await newUser.save();

    res.redirect('/');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
}

async function login(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/',
    failureFlash: true,
})(req, res );
}

function logout(req, res) {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });
}

module.exports = {
  signup,
  login,
  logout,
};
