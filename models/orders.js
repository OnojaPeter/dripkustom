const mongoose = require ('mongoose');

const orderSchema = new mongoose.Schema({
      orderNumber: {
        type: String,
        unique: true,
      },
      reference: {
        type: String,
        required: true
      },
      userEmail: {
        type: String,
        required: true
      },
      totalAmount: {
        type: Number,
        required: true
      },
      selectedAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address', // Reference to the Address model
        required: true
      },
      selectedPaymentMethod: {
        type: String,
        required: true
      },
      items: [{
        name: String,
        price: Number,
        size: String,
        quantity: Number
      }],
      orderDate: {
        type: Date,
        default: Date.now
      }
    });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order