const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId();


const User = new Schema({
    email: { type: String, unique: true},
    password: String,
    name: String
});

const Todo = new Schema({
    title: String,
    mark: Boolean,
    userId: ObjectId
});

const UserModel = mongoose.model('User', UserCollection);
const TodoModel = mongoose.model('Todo', TodoCollection);

module.exports = {
    UserModel: UserModel,
    TodoModel: TodoModel
};