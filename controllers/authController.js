const User = require('../models/user');
const passport = require('passport');
const bcrypt = require('bcryptjs');

async function signup(req, res, next) {
  try {
    const {signupUsername, signupEmail, signupPassword } = req.body;
    // console.log('email:', signupEmail);
    
    const existingUser = await User.findOne({ email: signupEmail });
    if (existingUser) {
      req.flash('error', 'User already exists');
      return res.json({ error: 'User already exists' });
    }

    const newUser = new User({ username: signupUsername, email: signupEmail, password: signupPassword });
    await newUser.save();

    req.logIn(newUser, async (err) => {
      if (err) {
        return next(err);
      }
      const source = req.body.source
      // console.log('source signup:', source);
      return res.json({user: '/', source: source});
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
}

async function login(req, res, next) {
  passport.authenticate('local', async (err, user, info) => {
      if (err) {
          return next(err);
      }
      if (!user) {
          // console.log('not user');
          req.flash('error', info.message);
          return res.json({ error: info.message });
      }

      // Log the user in
      req.logIn(user, async (err) => {
        const source = req.body.source
        // console.log('source:',source);
          if (err) {
              return next(err);
          }
          // Redirect based on user role
          if (user.role === 'admin') {
              return res.json('admin' );
          } else {
              return res.json({user: '/', source: source});
          }
      });
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
