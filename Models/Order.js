const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, 'User Id is required']
	},
	productsOrdered: [
		{
			productId: {
				quantity: Number,
				subtotal: Number
			}
		}
	],
	totalPrice: {
		type: Number,
		required: [true, 'totalPrice is required']
	},
	orderedOn: {
		type: Date,
		default: Date.now
	},
	status:{
		type: String,
		default: 'Pending'
	}
});

module.exports = mongoose.model('Order', orderSchema);