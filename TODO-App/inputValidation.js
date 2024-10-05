const {z} = require('zod');

function inputValidation(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    const signupBody = z.object({
        name: z.string().min(3).max(100),
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30)
    });

    const signinBody = z.object({
        email: z.string().min(3).max(100).email(),
        password: z.string().min(3).max(30)
    });

    const todoBody = z.object({
        title: z.string().min(3).max(100),
        status: z.boolean()
    });


   let success;
   
   if(req.originalUrl === '/signup') {
    parseData = signupBody.safeParse(req.body);
    success = parseData.success;
   }

   if(req.originalUrl === '/signin') {
    parseData = signinBody.safeParse(req.body);
    success = parseData.success;
   }

   if(req.originalUrl === '/add-todo') {
    parseData = todoBody.safeParse(req.body);
    success = parseData.success;
   }

   if(!success) {
    res.json({
        message: "Invalid Inputs"
    });
   }
   else {
    next();
   }
};

module.exports = {
    inputValidation
};