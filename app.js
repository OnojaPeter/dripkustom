const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { log } = require('util');
const path = require("path");
require('dotenv').config();
const session = require('express-session');
const cookieParser = require('cookie-parser');
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
      cookie: { secure: false },
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

app.use('/', homeRoute);
app.use('/about', aboutRoute);
app.use('/faqs', faqsRoute);
app.get('/shoe', shoeRoute);
app.use('/store-policy', storepolicyRoute);
app.use('/thank-you', thankyouRoute);
app.use('/checkout', checkoutRoute);
app.use('/add-to-cart', addtocartRoute);
app.use('/update-quantity', updatequantityRoute);
app.use('/remove-from-cart', removefromcartRoute);
app.use("/profile", profileRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});