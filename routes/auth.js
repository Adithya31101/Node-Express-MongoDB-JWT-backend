const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { isEmpty, validateEmail, validatePassword, validateUsername } = require('../validators');
const requiresLogin = require('../middleware/requiresLogin');

const validateSignup = (user) => {
    const error = {};
    if(isEmpty(user.email)) error.email = "Email cannot be empty!";
    if(isEmpty(user.name)) error.name = "Name cannot be empty!";
    if(isEmpty(user.username)) error.username = "Username cannot be empty!";
    if(isEmpty(user.password)) error.password = "Password cannot be empty!";
    if(isEmpty(user.description)) error.description = "Description cannot be empty!";
    
    if(!validateEmail(user.email)){
        error.email = "Invalid Email";
    }
    User.findOne({email: user.email})
      .then((existingUser) => {
          if(existingUser){
              error.email = "User already exists! try logging in!"; 
          }
      } )
    if(!validatePassword(user.password)){
        error.password = "Invalid Password";
    }
    if(!validateUsername(user.username)){
        error.username = "Username has been taken please try again";
    }
    return error;
}

const validateLogin = (user) => {
    const error = {};
    if(isEmpty(user.email)) error.email = "Email cannot be empty!";
    if(isEmpty(user.password)) error.password = "Password cannot be empty!";
    if(!validateEmail(user.email)){
        error.email = "Invalid Email";
    }
    return error;
}

router.post('/signup', (req, res) => {
    const user = req.body; 
    const error = validateSignup(user);
    if(Object.keys(error).length === 0){
        bcrypt.hash(user.password, 12)
          .then(hashedPassword => {
              user.password = hashedPassword
              const newUser = new User(user);
              newUser.save()
              .then(user => {
                  console.log(user.username + " has created an account!");
                  res.status(200).json({message: "User registered successfully!"});
              })
              .catch(err => {
                  console.log(err);
                  res.status(500).json({error: err});
              })
          
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
          });       
    } else {
        return res.status(422).json({error})
    }
    
})

router.post('/login', (req, res) => {
    const user = req.body;
    const error = validateLogin(user);
    if(Object.keys(error).length === 0){
        User.findOne({email: user.email})
          .then(userInDB => {
            if(!userInDB){
                res.json({error: "Invalid email or password"});
            } else {
                bcrypt.compare(user.password, userInDB.password)
                  .then(isSame => {
                      if(isSame){
                          const token = jwt.sign({_id: userInDB.id}, process.env.JWT);
                          res.json({
                              token,
                              username: userInDB.username,
                              email: userInDB.email                              
                          }).status(200);
                      } else {
                          res.json({error: "Invalid email or password"});
                      }
                  })
                  .catch(err => {
                      console.log("error: " + err);
                  })
            }
          })
          .catch(err => {
              console.log(err);
              res.status(500).json({error: err});
          });
    } else {
        res.status(422).json({error});
    }
});

router.get('/user',requiresLogin, (req, res) => {
    console.log(req.user);
})

module.exports = router;