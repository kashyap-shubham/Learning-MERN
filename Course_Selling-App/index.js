const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');


app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/admin', adminRouter)

// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => console.log('Connected to MongoDB')).catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Gracefully shut down the server on DB connection failure
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
