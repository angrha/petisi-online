const express=require("express");
const router=express.Router();

const Models  = require('../models')
const User    = Models.User

router.get("/",(req,res)=>{
  res.render("register");
})

router.post('/', (req, res) => {
  if(req.body.password === req.body.password_retype){
    User.create(req.body).then(function(result){
      res.redirect('/dashboard')
    })
  }else{
    res.send('please write your password correctly')
  }
})

module.exports=router;
