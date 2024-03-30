const Order = require('../models/orders');
const Address = require('../models/address');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'onojapeter90@gmail.com',
      pass: process.env.TRANSPORTER_PASS,
  }
});

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
  console.log('sent to paymentsuccess function');
  try {
    const userId = req.user._id;
    // console.log(userId);
    let generatedOrderNumber;
    if (selectedPaymentMethod === 'flutterwave') {
      generatedOrderNumber = reference;
      console.log('generatedOrderNumber:', generatedOrderNumber);
    } else {
        function generateOrderNumber() {
          return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
        }
        generatedOrderNumber = generateOrderNumber();
        console.log('generatedOrderNumber from paystack:', generatedOrderNumber);
    }
   
    const address = await Address.findById(selectedAddress);
    // console.log(address);

    const order = new Order({
      user: userId,
      orderNumber : generatedOrderNumber,
      reference: reference,
      userEmail: userEmail,
      totalAmount: totalAmount,
      selectedAddress: address,
      selectedPaymentMethod: selectedPaymentMethod,
      items: cartItems // Assuming your Order schema has a field named 'items' to store cart items
    });

    // Save the order to the database
    const savedOrder = await order.save();
    console.log('order email:', savedOrder.userEmail);

    await transporter.sendMail({
        to: `"Drip Kustom" <${savedOrder.userEmail}>`,
        subject: 'Order Confirmation',
        html: `
                <p>Thank you for your order!</p>
                <p>Your order has been successfully placed with the following details:</p>
                <ul>
                    <li>Order ID: ${savedOrder.orderNumber}</li>
                    <li>Total Amount:$ ${savedOrder.totalAmount}</li>
                </ul>
                <p>We will keep you updated on the status of your order.</p>
                <p>Thank you for shopping with us!</p>
        `,
    });

    res.json({ savedOrder });
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

