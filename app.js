const session=require("express-session");
const parser=require("body-parser");
const express=require("express");
const app=express();

// Settings
app.set("views","./views");
app.set("view engine","ejs");
app.use(express.static("views"));
app.use(parser.urlencoded({extended:false}));
app.use(parser.json());
app.use(session({
    secret:"pairproject"
}));

// Routing starts from here
const index=require("./router/index");
app.use("/",index);

const register=require("./router/register");
app.use("/register",register);

const dashboard=require("./router/dashboard");
app.use("/dashboard",dashboard);

const login=require("./router/login");
app.use("/login",login);

const profile=require("./router/profile");
app.use("/profile",profile);

app.get("/logout",(req,res)=>{
    req.session.loggedIn=false;
    res.redirect("/");
});

// Listen port
app.listen(3000,()=>{
    console.log("Listen to me now! I'm working on port 3000!");
});
// app.listen(process.env.PORT || "3000",()=>{
//     console.log("Listen to me now! I'm working on port 3000!");
// });
