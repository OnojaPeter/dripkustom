const mongoose = require ('mongoose');
const bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
});
  
// userSchema.plugin(passportLocalMongoose);
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
    //   console.log(hashedPassword);
      this.password = hashedPassword;
      next();
    } catch (error) {
      next(error);
    }
  });

const User = mongoose.model('User', userSchema);
// const dummyPerson = 
//         { email: "Peter@gmail.com",fname: 'onoja', lname: "peter", phone: "0576"};
        
//         // Add more items as needed
    
//     const populateDummyPerson = async () => {
//         try {
//             const docs = await User.insertMany(dummyPerson);
//             console.log('Dummy items inserted:', docs);
//         } catch (err) {
//             console.error('Error populating items:', err);
//         }
//     };
    
//     populateDummyPerson();

module.exports = User