const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


// MongoDB connection
mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => console.log('Connected to MongoDB')).catch((error) => {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Gracefully shut down the server on DB connection failure
});


const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String
});

const adminSchema = new Schema({
    email: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String

});

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
});

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId,
});

const userModel = mongoose.Model('user', userSchema);
const adminModel = mongoose.Model('admin', adminSchema);
const courseModel = mongoose.Model('course', courseSchema);
const purchaseModel = mongoose.Model('purchase', purchaseSchema);


module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}

