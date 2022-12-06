const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
require("dotenv").config();

//passport connfig
require('./config/passport')(passport);
const app = express();

const PORT = process.env.PORT || 5000;

//database
const uri = process.env.DB_CONNECT;
mongoose.connect(uri,{ useUnifiedTopology: true ,useCreateIndex: true, useNewUrlParser: true })
.then(()=>console.log('connected and double check'))
.catch((err)=>console.log(err));

const connection = mongoose.connection;
connection.once('open',()=>{
    console.log('connected to database');
})

//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//Express bodyparser
app.use(express.urlencoded({extended : false}));

//express session 
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variable
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})

//routes
const index = require("./routes/index.js");
const users = require("./routes/users.js");
app.use('/', index);
app.use('/users', users);

app.listen(PORT, console.log("listen to "+PORT));