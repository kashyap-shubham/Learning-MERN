const { Router } = require('express');
const userRouter = Router();
const { userModel } = require("../database/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

userRouter.post('/signup', auth, async (req, res) => {
    const { email, password, firstName, lastName } = req.body; // add zod validation here

    try {

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new admin in database
        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
        });

        // Return success response
        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: "An error occurred during signup" });
    }
});


userRouter.post('/signin', auth, async (req, res) => {
    const { email, password } = req.body; // add zod validation here

    try {
        // check if admin exists
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        // check for password match
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // generate jwt token
        let token;
        try {
            token = jwt.sign(
                { id: existingUser._id, email: existingUser.email }, // Add more claims if necessary
                process.env.JWT_SECRET_ADMIN,
                { expiresIn: process.env.JWT_EXPIRATION || '1h' } // Token expires in 1 hour
                );
        } catch(err) {
            console.log('Error generating token:', err);
            return res.status(500).json({ message: "Error generating authentication token"});
        }

        // Respond with the token (Optionally, you can set a cookie)
        res.status(200).json({
            message: "Signin successful",
            token: token // Or set cookie with: res.cookie('token', token, { httpOnly: true });
        });

    } catch (error) {
        console.error("Error during signin process:", error.message);
        res.status(500).json({
            message: "An internal Server error occured, please try again later"
        });
    }
});


userRouter.get('/purchased', (req, res) => {

});

module.exports = {
    userRouter: userRouter
};
