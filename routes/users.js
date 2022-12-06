const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//register lod model
const User = require('../model/User.model');

router.get('/',(req,res)=>{
    res.send('router user done')
})

router.get('/login',(req,res)=>{
    res.render('login')
})

router.get('/register',(req,res)=>{
    res.render('register')
})

//register
router.post('/register',(req,res)=>{
    
   const {name,email,password,password2} = req.body;
   let errors = [];

   //check the field
   if( !name || !email || !password || !password2){
       errors.push( {msg : 'please fill the form'});
       
   }

   //check password match
   if( password2 !== password){
       errors.push({msg : 'password do not match'});
       
   }

   //check password length
   if( password.length < 6){
       errors.push({msg: 'password should at least 6 character'});
        
   }
   

   if(errors.length > 0){
       res.render('register',{
           errors,
           name,
           email,
           password,
           password2
        })
   }
   else{
       User.findOne({email : email})
       .then( user => {
           if(user){
               errors.push({msg : 'Email already exist'});
               res.render('register', {
                   errors,
                   name,
                   email,
                   password,
                   password2
               });
           }
           else{
               const newUser = new User({
                   name,
                   email,
                   password
               })
               //hash the password
               
               }
           })
           User.findOne({name:name})
           .then( user => {
               if(user){
                   errors.push({msg : 'Name already exist'});
                   res.render('register', {
                       errors,
                       name,
                       email,
                       password,
                       password2
                   });
               }
               else{
                   const newUser = new User({
                       name,
                       email,
                       password
                   })
                   //hash the password
                   bcrypt.genSalt(10,(err,salt)=>{
                       bcrypt.hash(newUser.password,salt,(err,hash)=>{
                           if(err) throw err;
                           newUser.password = hash;
                           newUser.save()
                            .then(user => {
                                req.flash('success_msg','You are now registered and can log in');
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err));
    
                           })
                       })
                   }
               })

       }
   

})
//login handle
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
})

module.exports = router;