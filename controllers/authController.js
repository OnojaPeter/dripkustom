const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');

async function signup(req, res, next) {
  try {
    const {signupUsername, email, signupPassword } = req.body;
// console.log(req.body);
// console.log(signupUsername);
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    // Create a new user
    const newUser = new User({ username: signupUsername, email, password: signupPassword });

    // Save the user to the database
    await newUser.save();

    res.redirect('/');



    //   const user = new User({
    //     username: req.body.signupUsername,
    //     email: req.body.email,
    // });

    // // Hash the password using bcryptjs
    // const hashedPassword = await bcrypt.hash(req.body.signupPassword, 10);
    // user.password = hashedPassword;
    // console.log(user);
    // // console.log(hashedPassword);

    // // await user.save();

    // // res.redirect('/');
    // passport.authenticate('local')(req, res, () => {
    //     console.log('passport authentication successful');
    //   res.redirect('/');
    // });
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
})(req, res, next);
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
