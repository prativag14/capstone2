const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Product Name is Required']
    },
    Description: {
        type: String,
        required: [true, 'Product Description is Required']
    },
    Price: {
        type: Number,
        required: [true, 'Product Price is Required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);

