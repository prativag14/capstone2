const jwt = require("jsonwebtoken");

// [Section] Environment Setup
const dotenv = require("dotenv");
dotenv.config();

// Json web token
	//json web toke or JWT is a way of securely passing information from the server to the client or to the other part of the severs
	//information is kept secure through the use of the secret code
	//only the system that knows the secret code can decode the encrypted infromation.
	//only the person who knows the secret code can open the JWT


// [SECTION] Token Creation
module.exports.createAccessToken = (user) =>{
		// this contain the information of the user that logged in on the application
		const data = {
			id: user._id,
			email: user.email,
			isAdmin: user.isAdmin
		}

		// Generate a json web token using the jwt's sign method
		return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
	}

//[SECTION] Token verification
	//we will be unwrapping the JWT token
module.exports.verify = (req, res, next) => {
	// console.log(req.headers.authorization);

	let token = req.headers.authorization;

	if(typeof token === "undefined"){
		return res.send({auth : "Failed. No Token"});
	}else{
		token = token.slice(7, token.length);
		console.log(token);


		// Token decryption
			//validate the token using the verify method from jwt for decrypting the token using the secret code.

		jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken){

			if(err){
				return res.status(403).send({
					auth: "Failed",
					message: err.message
				})
			}else{
				req.user = decodedToken;
				// console.log(req);
				next();
			}


		})
	}


}


// [SECTION] Verify Admin
//this middleware will check if the user is admin or not.
module.exports.verifyAdmin = (req, res, next) => {
	console.log(req.user);

	if(req.user.isAdmin){
		next();
	}else{
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}


}

//[SECTION] Error Handler

module.exports.errorHandler = (err, req, res, next) =>{

	//log the error
	console.error(err);

	//Use the error message if available, otherwise default to 'Internal Server error'
	//Add status code 500
	const statusCode = err.status || 500;
	const errorMessage = err.message || 'Internal Server Error';

	//Sends a json response back to the client/POSTMAN
	res.status(statusCode).json({
		error:{
			message: errorMessage,
			errorCode: err.code || 'SERVER_ERROR',
			details: err.details || null
		}
	});
}

//[SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) =>{

	if(req.user){
		next()
	}else{
		res.sendStatus(401);
	}

}