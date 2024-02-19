const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware')
const adminController = require('../controllers/adminController')

router.get("/", adminController.admin);
router.get("/bestsellers", adminController.bestSellers);
router.get("/all-shoes", adminController.shoes);
router.get("/orders", adminController.orders);
router.get("/edit/:id", adminController.editShoePage);

router.post("/add-bestsellers", adminController.addBestsellers);
router.post("/add-shoe", adminController.addShoeCollection);
router.post("/edit/:id", adminController.editShoePost);

router.delete("/delete-bestseller-shoe/:id", adminController.deleteBestseller);
router.delete("/delete-shoe/:id", adminController.deleteShoe);


module.exports = router;