const express = require('express');
const router = express.Router();
const {isAuthenticated, isAdmin} = require('../middleware')
const adminController = require('../controllers/adminController')

router.get("/", isAuthenticated, adminController.admin);
router.get("/bestsellers", isAuthenticated, isAdmin, adminController.bestSellers);
router.get("/all-shoes", isAuthenticated, isAdmin, adminController.shoes);
router.get("/orders", isAuthenticated, isAdmin, adminController.orders);
router.get("/edit/:id", isAuthenticated, isAdmin, adminController.editShoePage);
router.get("/orders/:orderNumber", isAuthenticated, isAdmin, adminController.ordersByOrderNumber);

router.post("/add-shoe", isAuthenticated, isAdmin, adminController.addShoeCollection);
router.post("/edit/:id", isAuthenticated, isAdmin, adminController.editShoePost);

router.delete("/delete-shoe/:id", isAuthenticated, isAdmin, adminController.deleteShoe);


module.exports = router;