const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

// Google login
const passport = require('passport');
const session = require('express-session');


// cors allows backend application to be available to our frontend application
const cors = require("cors");

// [SECTION] Routes
const userRoutes = require("./routes/user");
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");

dotenv.config();

//[SECTION] Environment Setup
// const port = 4000;

//[SECTION] Server Setup
const app = express();

//[SECTION] Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const corsOptions = {
    origin: ['http://localhost:9000'],
    credentials: true,
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));

//session is a way to store information about a user across different request
app.use(session({
	secret: process.env.clientSecret,
	resave: false,
	saveUninitialized: false
}));

// Initializes the passport package when the application runs
app.use(passport.initialize());
// Creates a session using the passport package
app.use(passport.session());


// [SECTION] Database Setup
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "Error in the database connection!"));
db.once("open", ()=> console.log("Now connected to MongoDB Atlas."));


// [SECTION] Backend Routes
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);
app.use("/cart", cartRoutes);


// Server Gateway Response
if(require.main === module){
	app.listen(process.env.PORT || 9000, () => {
		console.log(`API is now online on port ${process.env.PORT || 9000}`);
	})
}

module.export = { app, mongoose };
