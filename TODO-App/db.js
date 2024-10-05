const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const User = new Schema({
    email: { type: String, unique: true},
    password: String,
    name: String
});

const Todo = new Schema({
    title: String,
    status: String,
    userId: ObjectId
});

const UserModel = mongoose.model('UserCollection', User);
const TodoModel = mongoose.model('TodoCollection', Todo);

module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
};