const { Router } = require('express');
const { adminModel } = require('../database/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRouter = Router();

// signing route
adminRouter.post('/singin', inputValidation, auth, async (req, res) => {
    const { email, password } = req.body; // add zod validation here

    try {
        // check if admin exists
        const existingUser = await adminModel.findOne({ email });
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
                process.env.JWT_SECRET,
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

// signup route
adminRouter.post('/singup', inputValidation, auth, async (req, res) => {
    const { email, password, firstName, lastName } = req.body; // add zod validation here

    try {

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a new admin in database
        await adminModel.create({
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


// adminRouter.use(adminMiddleware);

adminRouter.post('/create-course', (req, res) => {

});

adminRouter.put('/edit-course', (req, res) => {

});

adminRouter.get('/course/bulk', (req, res) => {

});


module.exports = {
    adminRouter: adminRouter
};