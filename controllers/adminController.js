const ShoeBestseller = require('../models/bestsellers');
const Shoes = require('../models/shoes');

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
        const bestSellers = await ShoeBestseller.find()
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
      res.render('adminOrders');
    } catch (error) {
      console.error(error);
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

async function addBestsellers (req, res){
    try{
        const { 
            imageUrl,
            shoeName,
            price,
            category} = req.body
            // console.log(req.body);

        const newBestseller = new ShoeBestseller({
            image: imageUrl,
            name: shoeName,
            price: price,
            category: category,
        });
       
        const savedBestseller = await newBestseller.save();

        // console.log('bestseller saved:', savedBestseller);
        res.redirect("/admin/bestsellers");
    } catch(err) {
        console.error(err);
    }
}

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
        // console.log(updatedPricelist);
        res.redirect("/admin/all-shoes");
    } catch (error) {
        // console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
//DELETE METHOD

async function deleteBestseller (req,res) {
    try {
        // const id = req.params.id;
        // console.log(id);
        const DeletedBestseller= await ShoeBestseller.findByIdAndDelete(req.params.id);
        // console.log('deleted bestseller:',DeletedBestseller);
        res.status(200).send({ message: 'Shoe deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

async function deleteShoe (req,res) {
    try {
        // console.log(req.params.id);
      const DeletedShoe= await Shoes.findByIdAndDelete(req.params.id);
    //   console.log('deleted shoe:',DeletedShoe);
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

    //post
    editShoePage,
    addBestsellers,
    addShoeCollection,
    editShoePost,

    //delete
    deleteBestseller,
    deleteShoe,

};