const express=require("express");
const app=express();

app.set("views","./public");
app.set("view engine","ejs");
app.use(express.static("public"));

const index=require("./router/index");
app.use("/",index);

const register=require("./router/register");
app.use("/register",register);

app.listen(3000,()=>{
    console.log("Listen to me now! I'm working on port 3000!");
});
