const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    email: String,
    fname: String,
    lname: String,
    phone: Number,
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