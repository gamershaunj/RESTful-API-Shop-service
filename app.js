const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser")
const mongoose = require("mongoose")

const app = express();


const productRoutes = require("./api/routes/products")
const orderRoutes =   require("./api/routes/orders")
const userRoutes    =require("./api/routes/users")

mongoose.connect("mongodb://localhost:27017/restshopdB",{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false })

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin','X-Requested-With','Content-Type','Accept','Authorization');

    if (req.method==="OPTIONS"){
        res.header("Access-Control-Allow-Methods",'PUT','PATCH','POST','DELETE','GET');
        return res.status(200).json({});
    }
    next();
})

app.use("/products",productRoutes);
app.use("/orders",orderRoutes);
app.use("/user",userRoutes);

app.use((req,res,next) =>{
    const error = new Error("Not found")
    error.status = 404
    next(error)
})

app.use((error,req,res,nexr)=>{
    
    res.status(error.status || 500)
    res.json({
        error: error.message
    })
})

module.exports = app;