const Order = require('../models/orders');
const Address = require('../models/address');

async function stripePayment (req, res) {
    try {
      // console.log(req.body.items);
      const itemsArray = Object.values(req.body.items);
      console.log(itemsArray);
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: itemsArray.map(item => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        success_url: `${process.env.CLIENT_URL}/thank-you`,
        cancel_url: `${process.env.CLIENT_URL}/checkout`,
      });
  
      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
};


async function paymentSuccess (req, res) {
  const { reference, userEmail, totalAmount, selectedAddress, selectedPaymentMethod, cartItems } = req.body;
  // console.log('cartItems:', cartItems);
  // console.log('Total Amount:',totalAmount);
  try {
    const userId = req.user._id;
    // console.log(userId);
    function generateOrderNumber() {
        return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
    }
    const address = await Address.findById(selectedAddress);
    // console.log(address);

    const order = new Order({
      user: userId,
      orderNumber : generateOrderNumber(),
      reference: reference,
      userEmail: userEmail,
      totalAmount: totalAmount,
      selectedAddress: address,
      selectedPaymentMethod: selectedPaymentMethod,
      items: cartItems // Assuming your Order schema has a field named 'items' to store cart items
    });

    // Save the order to the database
    const savedOrder = await order.save();

    // console.log('Order saved successfully:', savedOrder);

    res.status(200).send('Payment details received successfully.');
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Internal Server Error');
  }
};




module.exports = {
    //get
    stripePayment,
    paymentSuccess,
};

