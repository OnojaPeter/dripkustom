const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { log } = require('util');
const path = require("path");
require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');

const authRoutes = require('./routes/authRoutes');
const PORT = 3000;

const homeRoute = require("./routes/homeRoute")
const aboutRoute = require('./routes/aboutRoute');
const faqsRoute = require('./routes/faqsRoute');
const storepolicyRoute = require('./routes/storepolicyRoute');
const thankyouRoute = require('./routes/thankyouRoute');
const checkoutRoute = require('./routes/checkoutRoute');
const shoeRoute = require('./routes/shoeRoute')
const addtocartRoute = require('./routes/addtocartRoute')
const removefromcartRoute = require('./routes/removefromcartRoute')
const updatequantityRoute = require('./routes/updatequantityRoute')
const profileRoute = require('./routes/profileRoute')

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public', express.static('public'));
app.use('css', express.static('public/css', { 'extensions': ['css']}));
    
app.use(
    session({
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 *60 * 24 * 7,
        maxAge: 1000 * 60 *60 * 24 * 7
    }
    })
);


app.set('view engine', 'ejs');
// mongoose.connect('mongodb://127.0.0.1:27017/drip');
const uri = process.env.MONGODB_URI;

mongoose.connect(uri);
const db = mongoose.connection;
// Event listeners for connection status
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

const User = require('./models/user');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy({
  usernameField: 'loginEmail', // Specify the field used as the username
  passwordField: 'loginPassword', // Specify the field used as the password
}, async (email, password, done) => {
  try {
    // console.log(usernameField, passwordField);
    const user = await User.findOne({ email });
    // console.log(user,email, password);
    if (!user) {
      return done(null, false, { message: 'Incorrect email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());


app.use('/', homeRoute);
app.use('/about', aboutRoute);
app.use('/faqs', faqsRoute);
app.use('/shoe', shoeRoute);
app.use('/store-policy', storepolicyRoute);
app.use('/thank-you', thankyouRoute);
app.use('/checkout', checkoutRoute);
app.use('/add-to-cart', addtocartRoute);
app.use('/update-quantity', updatequantityRoute);
app.use('/remove-from-cart', removefromcartRoute);
app.use("/profile", profileRoute);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});