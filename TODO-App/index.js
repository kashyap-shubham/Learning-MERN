const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const { UserModel, TodoModel } = require('./db');
const { inputValidation } = require('./inputValidation');
const { auth } = require('./auth');


// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory (e.g., CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => console.log('Connected to MongoDB')).catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Gracefully shut down the server on DB connection failure
});


// Route to serve index.html from the 'public' directory
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.status(500).send("An error occurred while serving the homepage.");
        }
    });
});

app.get("/dashboard", auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'), (err) => {
        if (err) {
            res.status(500).send("An error occurred while serving the homepage.");
        }
    });
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
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: "An error occurred during signup" });
    }
});


// Signin route
app.post("/signin", inputValidation, async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({
                message: "User does not exist"
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT Token
        let token;
        try {
            token = jwt.sign(
                { id: existingUser._id.toString(), email: existingUser.email }, // Add more claims if necessary
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


// Add-todo Route
app.post("/add-todo", inputValidation, auth, async (req, res) => {
    const userId = req.userId;
    const { title, status } = req.body;

    // Check if required fields are provided
    if (!title || !status) {
        return res.status(400).json({
            message: "Title and status are required to create a todo"
        });
    }

    try {
        // Create the todo
        await TodoModel.create({
            title,
            status,
            userId
        });

        // Success response
        res.status(201).json({
            message: "Todo Created Successfully"
        });

    } catch (error) {
        console.error('Error creating todo:', error.message); // Log the error for debugging
        res.status(500).json({
            message: "Failed to create todo, please try again later"
        });
    }
});


// Check all todos route
app.get("/check-todos", auth, async (req, res) => {
    const userId = req.userId;

    try {
        // Find todos by userId and return plain JavaScript objects for better performance
        const todos = await TodoModel.find({ userId }).lean();

        // If no todos found, return an empty array (or use 404 if you prefer)
        if (!todos || todos.length === 0) {
            return res.status(200).json({
                message: "No todos found for this user",
                todos: []
            });
        }

        // Success response with found todos
        res.status(200).json({ todos });
    } catch (error) {
        // Log the error message with more context
        console.error(`Error fetching todos for user ${userId}:`, error.message);
        res.status(500).json({
            message: "An internal server error occurred while fetching todos"
        });
    }
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
