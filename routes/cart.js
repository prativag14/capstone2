const express = require("express");
const cartController = require("../controllers/cart.js");
const {verify, verifyAdmin} = require("../auth.js");
const passport = require('passport');
const router = express.Router();

router.get("/get-cart", verify, cartController.getCart);


router.post("/add-to-cart", verify, cartController.addTocart);

router.patch("/update-cart-quantity", verify, cartController.updateCart);

router.patch("/:productId/remove-from-cart", verify, cartController.removefromCart);

router.put("/clear-cart", verify, cartController.clearCart);




module.exports = router;