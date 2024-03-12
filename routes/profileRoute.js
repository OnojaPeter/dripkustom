const express = require('express');
const router = express.Router();
const {isAuthenticated, isAdmin} = require('../middleware')
const profileController = require('../controllers/profileController')

router.get("/person", isAuthenticated, profileController.person);

router.get("/edit-person", isAuthenticated, profileController.editPerson);

router.get("/edit-password",isAuthenticated, profileController.editPassword);

router.get('/address', isAuthenticated, profileController.address);

router.get('/edit-address/:addressId?', isAuthenticated, profileController.editAddressPage);

router.get("/order", isAuthenticated, profileController.order);

router.post("/edit-password",isAuthenticated, profileController.editPasswordPost);

router.post('/edit-address/:addressId?', isAuthenticated, profileController.editAddressPost);

router.post("/edit-person", isAuthenticated, profileController.editPersonPost);

router.delete('/delete-address/:addressId', isAuthenticated, profileController.deleteAddress);


module.exports = router;