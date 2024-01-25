const mongoose = require ('mongoose');

const addressSchema = new mongoose.Schema({
    email: String,
    fname: String,
    lname: String,
    state: String,
    city: String,
    country: String,
    streetAddress: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});
  
const Address = mongoose.model('Address', addressSchema);


// const dummyAddress = [
//         { email: "Peter@gmail.com",fname: 'onoja', lname: "peter", state: "lag", city: "ikd", country: "naija", streetAddress: "long ass address"},
//         { email: "ter@gmail.com",fname: 'oja', lname: "pet", state: "abj", city: "kubs", country: "naija", streetAddress: "stretch ass address"},
        
//         // Add more items as needed
//     ];
//     const populateDummyAddress = async () => {
//         try {
//             const docs = await Address.insertMany(dummyAddress);
//             console.log('Dummy items inserted:', docs);
//         } catch (err) {
//             console.error('Error populating items:', err);
//         }
//     };
    
//     populateDummyAddress();

module.exports = Address