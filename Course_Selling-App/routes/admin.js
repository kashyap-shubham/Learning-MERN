const { Router } = require('express');
const { adminModel } = require('../db');
const adminRouter = Router();


adminRouter.post('/singin', (req, res) => {

});

adminRouter.post('/singup', (req, res) => {

});


adminRouter.use(adminMiddleware);

adminRouter.post('/create-course', (req, res) => {

});

adminRouter.put('/edit-course', (req, res) => {

});

adminRouter.get('/course/bulk', (req, res) => {

});


module.exports = {
    adminRouter: adminRouter
};