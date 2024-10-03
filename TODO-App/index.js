const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const { UserModel, TodoModel } = require('./db');
const { inputValidation } = require('./inputValidation');

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1); // Gracefully shut down the server on DB connection failure
});


// Signup route
app.post("/signup", inputValidation, async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        // Hash the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        await UserModel.create({
            email,
            password: hashedPassword,
            name
        });

        // Return success response
        res.status(201).json({ message: "Signup successful" });

    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: "An error occurred during signup" });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
