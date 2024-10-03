const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const dotenv = require('dotenv').config();
const { UserModel, TodoModel } = require('./db');
const { inputValidation } = require('./inputValidation');


app.use(express.json());
mongoose.connect(dotenv.parsed.dbConnectionString);


app.post("signup", inputValidation, async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    try {
        const hashedPassword = await bcrypt.hash(password, 6);

        await UserModel.create({
            email: email,
            password: hashedPassword,
            name: name
        });

        res.json({
            message: "You are Signup Successfully"
        });
    }
    catch(e) {
        res.json({
            message: "Something Went Wrong"
        });
    }
});







app.listen(dotenv.parsed.Port, ()=> {
    console.log("Server Started at 3000");
});