const express = require("express");
const orderController = require("../controllers/order");
const {verify, verifyAdmin} = require("../auth");
const passport = require('passport');
const router = express.Router();

router.post("/checkout", verify, orderController.createOrder);


router.get("/my-orders", verify, orderController.myOrders);

router.get("/all-orders", verify, verifyAdmin, orderController.allOrders);


module.exports = router;