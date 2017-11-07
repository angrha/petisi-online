const parser=require("body-parser");
const express=require("express");
const app=express();

// Settings
app.set("views","./views");
app.set("view engine","ejs");
app.use(express.static("view"));
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());

// Routing starts from here
const index=require("./router/index");
app.use("/",index);

const register=require("./router/register");
app.use("/register",register);

const dashboard=require("./router/dashboard");
app.use("/dashboard",dashboard);

// Listen port
app.listen(3000,()=>{
    console.log("Listen to me now! I'm working on port 3000!");
});