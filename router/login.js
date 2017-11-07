const express =require("express");
const router  =express.Router();

const Models  = require('../models')
const Login   = Models.User

router.get("/",(req,res)=>{
  res.render("login");
})

router.post('/', (req, res) => {
  
})
