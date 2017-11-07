const express=require("express");
const app=express();

app.set("views","./public");
app.set("view engine","ejs");
app.use(express.static("public"));

const index=require("./router/index.js");
app.use("/",index);

app.listen(3000,()=>{
    console.log("Listen to me now! I'm working on port 3000!");
});
