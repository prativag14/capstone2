// [SECTION] Dependencies and Modules
const express = require("express");

const userController = require("../controllers/user.js");
const {verify, isLoggedIn } = require("../auth.js");

// Google login
const passport = require('passport');


// [SECTION] Routing Component
const router = express.Router();

// User registration 

router.post("/register", userController.registerUser); 

//User authentication 

router.post("/login", userController.loginUser)

//Retrieve User details 
router.get("/details", verify, userController.getProfile);

// Update User as Admin 
router.patch("/:id/set-as-admin", verify, userController.updateAdmin); 

//Update Password 
router.patch('/update-password', verify, userController.updatePassword);

module.exports = router;