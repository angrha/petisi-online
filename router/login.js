const express = require("express");
const router  = express.Router();

const bcrypt = require('bcrypt');
const Models  = require('../models')
const Login   = Models.User

router.get('/', function(req, res){
  res.render('login', {error: false})
})

router.post('/', (req, res) => {
  Login.findOne({
    where: {
      username: req.body.username
    }
  }).then(function(user){
    if(user){
      bcrypt.compare(req.body.password, user.password).then((result) => {
        if(result){
          req.session.loggedIn = true;
          req.session.username = user.username
          res.redirect('/dashboard')
        }
        else{
          res.render('dashboard')
        }
      })
    }else {
      res.render('login')
    }
  }).catch(err => {
    console.log(err);
  })
})

module.exports = router
