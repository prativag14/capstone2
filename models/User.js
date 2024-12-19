const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is Required']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is Required']
    },
    mobileNo: {
        type: Number,
        required: [true, 'Mobile number is Required']
    },
    isAdmin: {
        type: Boolean,
        required: [false, 'isAdmin is not required']
    },
    email: {
        type: String,
        required:[true, 'Email is Required']
    },
    password: {
        type: String,
        required:[true, 'Password is Required']
    }
});

module.exports = mongoose.model('User', userSchema);

