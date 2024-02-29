const ShoeBestseller = require('../models/bestsellers');
const Shoes = require('../models/shoes');
const Order = require('../models/orders');

//GET METHOD
async function admin (req,res) {
    try {
      res.render('adminHomepage');
    } catch (error) {
      console.error(error);
    }
}

async function bestSellers (req,res) {
    try {
        const bestsellerItems = await ShoeBestseller.find();
        const bestsellerIds = bestsellerItems.map(item => item.shoe); 

        // console.log('bestseller IDs:', bestsellerIds);
        const bestSellers = await Shoes.find({ _id: { $in: bestsellerIds } });
        res.render('adminBestsellers', {bestSellers});
    } catch (error) {
        console.error(error);
    }
}

async function shoes (req,res) {
    try {
        const shoes = await Shoes.find()
        res.render('adminAllShoes', {shoes});
    } catch (error) {
        console.error(error);
    }
}

async function orders (req,res) {
    try {
        const order = await Order.find().populate('selectedAddress');
        res.render('adminOrders', {order});
    } catch (error) {
        console.error(error);
    }
}

async function ordersByOrderNumber(req, res) {
    const orderNumber = req.params.orderNumber;

    try {
        // Find the order by orderNumber
        const order = await Order.findOne({ orderNumber }).populate('selectedAddress');
        console.log(order);

        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.render('adminOrderNumber', {order});
        // Return the order if found
        // res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
//GET EDIT_PAGE

async function editShoePage( req, res) {
    try {
       const shoe = await Shoes.findById(req.params.id);
    //    console.log(menu);
       res.render("adminEditShoe", {shoe})
    } catch (error) {
        // console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

//POST METHOD

async function addShoeCollection (req, res){
    try{
        const { 
            imageUrl,
            shoeName,
            price,
            category} = req.body
            // console.log(req.body);

        const newShoe = new Shoes({
            image: imageUrl,
            name: shoeName,
            price: price,
            category: category,
        });
       
        const savedShoe = await newShoe.save();

        console.log('shoe saved:', savedShoe);
        res.redirect("/admin/all-shoes");
    } catch(err) {
        console.error(err);
    }
}

async function editShoePost (req, res) {
    try {
        const updatedShoe = await Shoes.findByIdAndUpdate(req.params.id, { $set: req.body });
        const bestsellerShoe = await ShoeBestseller.findOne({ shoe: req.params.id });

        if (bestsellerShoe) {
            await ShoeBestseller.updateOne({ shoe: req.params.id }, { $set: req.body });
        }
        console.log('bestseller updated:', bestsellerShoe);
        res.redirect("/admin/all-shoes");
    } catch (error) {
        // console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
//DELETE METHOD

async function deleteShoe (req,res) {
    try {
        // console.log(req.params.id);
      const DeletedShoe= await Shoes.findByIdAndDelete(req.params.id);
      const bestsellerShoe = await ShoeBestseller.findOne({ shoe: req.params.id });
    //   console.log('shoe to be deleted from bestseller:', bestsellerShoe);

      if(bestsellerShoe) {
        await ShoeBestseller.deleteOne({ shoe: req.params.id })
      }
      res.status(200).send({ message: 'Shoe deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
}



module.exports = {
    //get
    admin,
    bestSellers,
    shoes,
    orders,
    ordersByOrderNumber,

    //post
    editShoePage,
    addShoeCollection,
    editShoePost,

    deleteShoe,

};