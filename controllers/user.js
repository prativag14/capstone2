// [SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");

//User Registration

module.exports.registerUser = (req, res) => {

    // Checks if the email is in the right format
    if (!req.body.email.includes("@")){
        // if the email is not in the right format, send a message 'Invalid email format'.
        return res.status(400).send({ message: 'Invalid email format' });
    }
    // Checks if the mobile number has the correct number of characters
    else if (req.body.mobileNo.length == 11){
        // if the mobile number is not in the correct number of characters, send a message 'Mobile number is invalid'.
        return res.status(400).send({ message: 'Mobile number is invalid' });
    }
    // Checks if the password has atleast 8 characters
    else if (req.body.password.length < 8) {
        // If the password is not atleast 8 characters, send a message 'Password must be atleast 8 characters long'.
        return res.status(400).send({ message: 'Password must be atleast 8 characters long' });
    // If all needed requirements are achieved
    } else {
        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 8),
            isAdmin: req.body.isAdmin
        })

        return newUser.save()
        // if all needed requirements are achieved, send a success message 'User registered successfully' and return the newly created user.
        .then((result) => res.status(201).send({
            message: 'User registered successfully',
            user: result
        }))
        .catch(error => errorHandler(error, req, res));
    }
};

//User Authentication

module.exports.loginUser = (req, res) => {
    if(req.body.email.includes("@")){
        return User.findOne({ email: req.body.email })
            .then(result => {
                if(result == null){

                    return res.status(404).send({message: 'No email found'});
                } else {
                    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                    if (isPasswordCorrect) {
                        return res.status(200).send({ 
                            message: 'User logged in successfully',
                            access: auth.createAccessToken(result)
                        })
                    } else {
                        return res.status(401).send({message: 'Incorrect email or password'});
                    }
                }

            }).catch(err => errorHandler(error, req, res));
    }
    else{
        return res.status(400).send({message: 'Invalid email format'})
    }
}


//Retrieve user details

module.exports.getProfile = (req, res) => {
    return User.findById(req.user.id)
    .then(user => {

        if(!user){
            return res.status(403).send({ message: 'invalid signature' })
        }else {
            user.password = "";
            return res.status(200).send(user);
        }  
    })
    .catch(error => errorHandler(error, req, res));
};

// Function to update the password
module.exports.updatePassword = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 8);

        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Set user as admin 

 module.exports.updateAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = 'admin';
        await user.save();

        res.status(200).json({ message: `User ${userId} is now an admin` });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
