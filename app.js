if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
console.log(process.env.SECRET)



const { application } = require('express');
const express = require('express');
const app = express();
const path = require('path');
 const Campgrounds = require ('./models/campground')
const mongoose = require('mongoose');
const methodOver = require('method-override')
const ejsMate = require ('ejs-mate');
const catchAsync = require ('./utils/catchAsync');
const ExpressError = require ('./utils/ExpressError');
const Joi = require ('joi');
const {camSchema, revSchema} = require('./schemas.js');
const Review = require('./models/review');
const Camps = require ('./routes/cam');
const Revs = require ('./routes/rev')
const session = require ('express-session');
const flash = require ('connect-flash');
const passport = require ('passport');
const LocalStrategy = require ('passport-local');
const User = require ('./models/user');


const userRoutes = require ('./routes/users')

mongoose.connect('mongodb://localhost:27017/mappingyelp-camp')
.then(()=>{
    console.log('Mongo Connection Open!!')
}).catch(err =>{
    console.log("Oh no Mongo Error!!")
    console.log(err)
})

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(methodOver('_method'))
app.use(express.static('public'));

const SessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly: true,
        expires : Date.now() + 100 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(SessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
   // console.log(req.session)
    res.locals.currentUser = req.user;
    //console.log('thiss issss', currentUser)
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/makecampground', async(req, res) =>{
    const camp = new Campgrounds({tittle: 'My Backyard', description: 'cheap camping'});
    await camp.save();
    res.send(camp)
})

app.use('/', userRoutes );
app.use('/campground', Camps)
app.use('/campground/:id/reviews', Revs)




app.all('*', (req, res, next) =>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) =>{
  const {statusCode = 500} = err;
  if(!err.message) err.message = 'oh no Something went Wrong!'
  res.status(statusCode).render('error', {err});
})

app.listen('3063',() =>{
    console.log('app listen on port 3063')
})



