const express=require('express')
const app=express()
const mongoose = require("mongoose")
const helmet=require("helmet")

const userRoute=require("./routes/users")
const authRoute=require('./routes/auth')
const postroute=require('./routes/posts')



mongoose.connect('mongodb://localhost:27017/socialapp',()=>{
    console.log("Database is connected")
})

//middlewares
app.use(express.json())
app.use(helmet())

app.use("/api/users",userRoute);
app.use("/api/auth",authRoute);
app.use("/api/posts",postroute);



app.get('/',(req,res)=>{
    res.send("welcome to home page")
})
app.get('/users',(req,res)=>{
    res.send("welcome to users page")
})



app.listen(8800,()=>{
    console.log("Backend server is running");
})