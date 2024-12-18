const express = require("express");

const {verify, verifyAdmin} = require("../auth.js");
const passport = require('passport');
const router = express.Router();
const Order = require("../models/Order.js");
const Cart = require("../models/Cart.js");
const Product = require("../models/Product"); 
const auth = require("../auth");

module.exports.createOrder = async (req, res) => {
  try {
    // Validate user identity via JWT
    const userId = req.user.id;

    // Find the cart for the authenticated user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "No cart found for the user." });
    }

    // Ensure cartItems exists and is an array
    if (!Array.isArray(cart.cartItems) || cart.cartItems.length === 0) {
      return res.status(400).json({
        message: "No items to checkout.",
      });
    }

    // Create a new Order document
    const newOrder = new Order({
      userId,
      productsOrdered: cart.cartItems,
      totalPrice: cart.totalPrice,
    });

    // Save the order document
    await newOrder.save();

    // Clear the user's cart after successful order placement
    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    // Send success response with order details
    return res.status(201).json({
      message: "Order successfully placed",
      order: newOrder,
    });
  } catch (error) {
    // Error handling
    return res.status(500).json({
      message: "An error occurred while processing the order.",
      error: error.message,
    });
  }
};

exports.myOrders = async (req, res) => {
  try {
    // 1. Validate User Identity (JWT)
    const userId = req.user.id;

    // 2. Find orders for the current user
    const orders = await Order.find({ userId: userId });

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    // 3. Populate the product names in the orders
    const populatedOrders = await Promise.all(
      orders.map(async (order) => {
        const populatedProducts = await Promise.all(
          order.productsOrdered.map(async (product) => {
            console.log("Fetching product details for ID:", product.productId); // Debugging

            const productDetails = await Product.findById(
              product.productId
            ).select("name");

            if (!productDetails) {
              console.log(`Product with ID ${product.productId} not found!`); // Debugging
            }

            return {
              ...product.toObject(),
              productName: productDetails
                ? productDetails.name
                : "Unknown Product",
            };
          })
        );
        return {
          ...order.toObject(),
          productsOrdered: populatedProducts,
        };
      })
    );

    // 4. Send the orders with populated product names to the client
    res.status(200).json(populatedOrders);
  } catch (error) {
    // 5. Catch and send errors
    console.error("Error while fetching orders:", error.message); // Debugging
    res.status(500).json({
      message: "An error occurred while retrieving the orders.",
      error: error.message,
    });
  }
};

exports.allOrders = async (req, res) => {
  try {
    // 1. Validate Admin User Identity (JWT)
    const isAdmin = req.user.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // 2. Find all orders
    const orders = await Order.find();

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    // 3. Send all orders to the client
    res.status(200).json(orders);
  } catch (error) {
    // 4. Catch and send errors
    res.status(500).json({
      message: "An error occurred while retrieving the orders.",
      error: error.message,
    });
  }
};