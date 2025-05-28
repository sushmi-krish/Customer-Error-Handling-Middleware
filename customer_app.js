// Importing necessary libraries and modules
const mongoose = require('mongoose');            // MongoDB ODM library
const Customers = require('./customer');         // Imported MongoDB model for 'customers'
const express = require('express');              // Express.js web framework
const bodyParser = require('body-parser');       // Middleware for parsing JSON requests
const path = require('path');                    // Node.js path module for working with file and directory paths
const {ValidationError,InvalidUserError,AuthenticationFailed} = require('./errors/CustomError')
// Creating an instance of the Express application
const app = express();

// Setting the port number for the server
const port = 3001;

// MongoDB connection URI and database name
const uri =  "mongodb://root:IMDn9TEwRzlLFWhpgqRmcZmX@172.21.111.226";
mongoose.connect(uri, {'dbName': 'customerDB'});

// Middleware to parse JSON requests
app.use("*", bodyParser.json());

// Serving static files from the 'frontend' directory under the '/static' route
app.use('/static', express.static(path.join(".", 'frontend')));

// Middleware to handle URL-encoded form data
app.use(bodyParser.urlencoded({ extended: true }));

// POST endpoint for user login
app.post('/api/login', async (req, res) => {
    const data = req.body;
    console.log(data);
    let user_name = data['user_name'];
    let password = data['password'];
   
    try{
        const user = await Customers.findOne({user_name:user_name})
        if(!user){
            throw new InvalidUserError("No such user in data base");

        }
        if(user.password !== password){
            throw new AuthenticationFailed("passwords don't match");
        }
        res.send("User Logged In");

    }catch(error){
        next(error);
    }
});

// POST endpoint for adding a new customer
app.post('/api/add_customer', async (req, res,next) => 
{
    const data = req.body;
    const age  = parseInt(data['age']);
    try{
        if(age<21){
            throw new ValidationError("Customer Under required age limit");

        }
        const name = data['name'];
        if(!name || typeof name !== 'string' || name.trim()===''){
        throw new ValidationError("Invalid name: must be  string");
        }
        const existing = await Customers.findOne({user_name:data['user_name']});
        if(existing){
            throw new ValidationError("User already exits");
        }
        const customer = new Customers({
            "user_name": data['user_name'],
            "age":age,
            "password":data['password'],
            "email":data['email'],
            name: name.trim()
        });
        await customer.save();

        res.send("Customer added successfully");
    }catch(error){
        next(error)
    }

});
//Get endpoint for user logout
app.get('/api/logout',async(req,res)=>{
    res.cookie('username','',{expires:new Date(0)});
    res.redirect('/');
});

// GET endpoint for the root URL, serving the home page
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});
//Middleware

app.all((req,res,next)=>{
    const err = new Error(`Cannot find the URL${req.originalUrl} in this application.Please check .`)
    err.status = "EndPoint Failure";
    err.statusCode = 404;
    next(err);
})

//gobal error handler
app.use((err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';
    console.log(err.stack);
    res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
    });
})

// Starting the server and listening on the specified port
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
