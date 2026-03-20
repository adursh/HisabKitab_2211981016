const express = require('express');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const { addCustomer, fetchUser, renameCustomer, updateProfile } = require('../controllers/customerControllers');

const router = express.Router();
router.post('/addcustomer', jwtMiddleware, addCustomer);
router.get('/fetchuser', jwtMiddleware, fetchUser);
router.post('/rename', jwtMiddleware, renameCustomer);
router.post('/updateprofile', jwtMiddleware, updateProfile);

module.exports = router;
